/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: User login.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 example: example@email.com
 *               password:
 *                 type: string
 *                 required: true
 *                 example: 12345678
 *
 *     responses:
 *       200:
 *         description: User login successful.
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
 *                       example: Bearer jqndwjsidbfwbeyribi...
 *                     name:
 *                       type: string
 *                       example: BigShop
 *                     logo:
 *                       type: string
 *                       example: https://example.com/logo.png
 *                     email:
 *                       type: string
 *                       example: example@email.com
 *                     apiKey:
 *                       type: string
 *                       example: api_key_12345
 *                     tokens:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           symbol:
 *                             type: string
 *                             example: usdt
 *                     methods:
 *                       type: number
 *                       example: 1
 *                     isSubscribed:
 *                       type: boolean
 *                       example: true
 *                     minimumCancellableStreamDuration:
 *                       type: number
 *                       example: 60
 *
 *       400:
 *         description: Validation failed due to invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Validation failed
 *                     extras:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: string
 *                             example: email
 *                           message:
 *                             type: string
 *                             example: Invalid email address
 *
 *       404:
 *         description: User not found or password incorrect.
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
 *                       example: User not found
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
