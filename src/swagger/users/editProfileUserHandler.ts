/**
 * @swagger
 * /users/{id}/settings:
 *   put:
 *     summary: Edit user settings.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user whose settings are to be edited.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21bb67c0d8c6f6c3f4d8c"
 *       - name: Authorization
 *         in: header
 *         description: JWT Token.
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 required: true
 *                 properties:
 *                   methods:
 *                     type: number
 *                     description: The method ID associated with the user.
 *                     example: 1
 *                   minimumCancellableStreamDuration:
 *                     type: number
 *                     description: Minimum duration for cancellable streams.
 *                     example: 30
 *                   tokens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         symbol:
 *                           type: string
 *                           description: Token symbol.
 *                           example: "usdt"
 *                   isSubscribed:
 *                     type: boolean
 *                     description: Subscription status of the user.
 *                     example: true
 *     responses:
 *       200:
 *         description: Successful editing of the user settings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: Updated user object.
 *                       example: {
 *                         "_id": "60d21bb67c0d8c6f6c3f4d8c",
 *                         "settings": {
 *                           "methods": 1,
 *                           "minimumCancellableStreamDuration": 30,
 *                           "tokens": [
 *                             { "symbol": "usdt" }
 *                           ],
 *                           "isSubscribed": true
 *                         }
 *                       }
 *       400:
 *         description: Invalid settings data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid settings data"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */