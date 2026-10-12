import log from '../config/logger';
import envs from '../config/envs';
import { IUser } from '../models/User';
import { validateEmail, validAddress } from './validators';

const BLUX_API_URL = 'https://api.blux.cc';
const BLUX_REQUEST_TIMEOUT_MS = 10_000;
const WALLET_VERIFY_TTL_MS = 60_000;

type BluxErrorBody = {
  error?: string;
  message?: string;
};

type BluxEnvelope<T> = BluxErrorBody & {
  result?: T;
};

type BluxVerifyWalletResult = {
  exists: boolean;
  user_id?: number;
  auth_method?: string;
  network?: string;
  wallet_type?: 'custodial' | 'external';
};

type BluxSessionUser = {
  auth_method?: string;
  auth_value?: string;
  public_key?: string;
};

type BluxProjectUser = {
  id?: number;
  auth_method?: string;
  auth_value?: string;
  accounts?: Array<{ public_key?: string; network?: string }>;
};

export type VerifiedBluxIdentity = {
  address: string;
  bluxUserId: number;
  email?: string;
  authMethod?: string;
};

export class BluxVerificationError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = 'BluxVerificationError';
    this.status = status;
  }
}

const verifiedUntil = new Map<string, number>();

const bluxServerHeaders = () => {
  const { BLUX_APP_ID, BLUX_APP_SECRET } = envs();

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'blux-app-id': BLUX_APP_ID,
    'blux-app-secret': BLUX_APP_SECRET,
  };
};

const errorText = (payload: BluxErrorBody, fallback: string) => {
  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
};

const parseEnvelope = async <T>(response: Response): Promise<BluxEnvelope<T>> => {
  try {
    return (await response.json()) as BluxEnvelope<T>;
  } catch {
    return {};
  }
};

const fetchBlux = async (path: string, init: RequestInit) => {
  try {
    return await fetch(`${BLUX_API_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(BLUX_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    log.error(`BLUX: ${path} request failed - ${reason}`);
    throw new BluxVerificationError('Blux is unavailable', 503);
  }
};

const emailFromAuthValue = (authValue?: string) => {
  if (!authValue || !validateEmail(authValue)) {
    return undefined;
  }

  return authValue.toLowerCase();
};

const stellarAddressFromProjectUser = (projectUser?: BluxProjectUser) => {
  const account = projectUser?.accounts?.find(
    (item) => item.network === 'stellar' && item.public_key && validAddress(item.public_key),
  );

  return account?.public_key;
};

const verifyWalletWithBlux = async (address: string, userId?: number) => {
  const body: { address: string; user_id?: number } = { address };

  if (userId) {
    body.user_id = userId;
  }

  const response = await fetchBlux('/server/wallets/verify', {
    method: 'POST',
    headers: bluxServerHeaders(),
    body: JSON.stringify(body),
  });

  const payload = await parseEnvelope<BluxVerifyWalletResult>(response);

  if (response.status === 401) {
    log.error('BLUX: Server API rejected the app id or app secret');
    throw new BluxVerificationError('Blux verification failed', 502);
  }

  if (!response.ok) {
    log.error(`BLUX: Wallet verify failed (${response.status})`);
    throw new BluxVerificationError(
      errorText(payload, 'Blux verification failed'),
      response.status === 400 ? 400 : 502,
    );
  }

  return payload.result;
};

const fetchBluxProjectUser = async (userId: number) => {
  const response = await fetchBlux(`/server/users/${userId}`, {
    method: 'GET',
    headers: bluxServerHeaders(),
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    log.error(`BLUX: User lookup failed (${response.status})`);
    throw new BluxVerificationError(
      'Blux verification failed',
      response.status === 401 ? 502 : 503,
    );
  }

  const payload = await parseEnvelope<BluxProjectUser>(response);
  return payload.result;
};

const fetchBluxSessionUser = async (bluxToken: string) => {
  const response = await fetchBlux('/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bluxToken}`,
    },
  });

  const payload = await parseEnvelope<BluxSessionUser>(response);

  if (response.status === 401 || response.status === 404) {
    throw new BluxVerificationError('Blux session is invalid');
  }

  if (!response.ok) {
    log.error(`BLUX: Session lookup failed (${response.status})`);
    throw new BluxVerificationError(
      errorText(payload, 'Blux session lookup failed'),
      response.status >= 500 ? 503 : 502,
    );
  }

  return payload.result;
};

/**
 * Proves the Blux session JWT is a real login for this project and returns
 * the G address Blux assigned. The address is never taken from the client.
 */
export const verifyBluxSession = async (bluxToken: string): Promise<VerifiedBluxIdentity> => {
  const sessionUser = await fetchBluxSessionUser(bluxToken);
  const address = sessionUser?.public_key?.trim();

  if (!address || !validAddress(address)) {
    throw new BluxVerificationError('Blux did not return a Stellar address');
  }

  const verified = await verifyWalletWithBlux(address);

  if (!verified?.exists || !verified.user_id) {
    throw new BluxVerificationError('Blux wallet is not verified');
  }

  if (verified.network && verified.network !== 'stellar') {
    throw new BluxVerificationError('Only Stellar wallets can sign in to Wagent');
  }

  return {
    address,
    bluxUserId: verified.user_id,
    email: emailFromAuthValue(sessionUser?.auth_value),
    authMethod: sessionUser?.auth_method || verified.auth_method,
  };
};

const rememberVerifiedWallet = (bluxUserId: number, address: string) => {
  verifiedUntil.set(`${bluxUserId}:${address}`, Date.now() + WALLET_VERIFY_TTL_MS);
};

const walletStillVerified = (bluxUserId: number, address: string) => {
  const until = verifiedUntil.get(`${bluxUserId}:${address}`);

  if (!until) {
    return false;
  }

  if (until <= Date.now()) {
    verifiedUntil.delete(`${bluxUserId}:${address}`);
    return false;
  }

  return true;
};

/**
 * Confirms a stored merchant still owns their G address inside this Blux
 * project. Called on authenticated Wagent requests so a copied JWT cannot
 * keep working after the Blux user is removed.
 */
export const assertBluxProjectWallet = async (user: IUser) => {
  if (!user.bluxUserId) {
    throw new BluxVerificationError('Sign in with Blux to continue');
  }

  if (walletStillVerified(user.bluxUserId, user.address)) {
    return;
  }

  let verified = await verifyWalletWithBlux(user.address, user.bluxUserId);

  if (!verified?.exists) {
    const projectUser = await fetchBluxProjectUser(user.bluxUserId);
    const nextAddress = stellarAddressFromProjectUser(projectUser);

    if (nextAddress && nextAddress !== user.address) {
      user.address = nextAddress;

      try {
        await user.save();
      } catch (error) {
        log.error(`BLUX: Could not store the updated Stellar address - ${error}`);
        throw new BluxVerificationError('This Blux login is no longer valid');
      }

      verified = await verifyWalletWithBlux(user.address, user.bluxUserId);
    }
  }

  if (!verified?.exists || verified.user_id !== user.bluxUserId) {
    throw new BluxVerificationError('This Blux login is no longer valid');
  }

  if (verified.network && verified.network !== 'stellar') {
    throw new BluxVerificationError('Only Stellar wallets can use Wagent');
  }

  rememberVerifiedWallet(user.bluxUserId, user.address);
};
