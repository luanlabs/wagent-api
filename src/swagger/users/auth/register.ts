/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: Sign in or create a merchant from a Blux session.
 *     description: >
 *       Same handler as `POST /users/auth/login`. The client sends the Blux
 *       session JWT only. Wagent reads the G address from Blux and creates
 *       the merchant on first login.
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
 *                     address:
 *                       type: string
 *
 *       401:
 *         description: Blux session or wallet could not be verified
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
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *
 *       409:
 *         description: The Blux wallet is already linked to a different merchant.
 *
 *       503:
 *         description: Blux could not be reached.
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
 *                   example: Failed to register user
 */
