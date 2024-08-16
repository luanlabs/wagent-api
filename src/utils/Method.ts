import { Methods } from '../constants/OrderValue';

export type MethodsType = 'single' | 'stream' | 'vesting';

type CombinedMethodsType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const Single = 1;
const Stream = 2;
const Vesting = 4;

class Method {
  public static fromString(methods: MethodsType[]): CombinedMethodsType {
    let combinedMethods = 0;

    for (const method of methods) {
      if (method === Methods.Single) {
        combinedMethods |= Single;
      }

      if (method === Methods.Stream) {
        combinedMethods |= Stream;
      }

      if (method === Methods.Vesting) {
        combinedMethods |= Vesting;
      }
    }

    return combinedMethods as CombinedMethodsType;
  }

  public static toString(methods: CombinedMethodsType): MethodsType[] {
    const convertedMethods: MethodsType[] = [];

    if (methods & Single) {
      convertedMethods.push(Methods.Single);
    }

    if (methods & Stream) {
      convertedMethods.push(Methods.Stream);
    }

    if (methods & Vesting) {
      convertedMethods.push(Methods.Vesting);
    }

    return convertedMethods;
  }
}

export default Method;
