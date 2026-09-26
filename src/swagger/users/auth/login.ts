/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: Sign in or create a merchant from a Blux session.
 *     description: >
 *       Login and registration are the same request. The client completes the
 *       Blux modal, then sends only the Blux session JWT. The API loads the
 *       current user from `GET /users`, confirms the G address with
 *       `POST /server/wallets/verify`, and issues a Wagent JWT. Later
 *       authenticated requests re-check that wallet. The withdrawal address
 *       always comes from Blux.
 *     tags: [AAA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bluxToken
 *             properties:
 *               bluxToken:
 *                 type: string
 *                 description: Blux session JWT stored by @bluxcc/react after login.
 *
 *     responses:
 *       200:
 *         description: User signed in. A merchant account is created on first login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login was successful
 *                 result:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: jqndwjsidbfwbeyribikdfhkdfhdk
 *                     address:
 *                       type: string
 *                       example: GBLUXDDBTGCLIC3TYAFYUJ5EO2MPXBSFMU7GHNLQ6IZWEJVXWMLBLUXX
 *
 *       400:
 *         description: Validation failed due to invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *
 *       401:
 *         description: Blux session or wallet could not be verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Blux session is invalid
 *
 *       409:
 *         description: The Blux wallet is already linked to a different merchant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed
 *
 *       503:
 *         description: Blux could not be reached.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to login user
 */
