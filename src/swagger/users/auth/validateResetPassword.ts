/**
 * @swagger
 * /users/auth/reset/:token:
 *   get:
 *     summary: Verifies the reset token. Is used to check if the token is valid before asking for a new password from user
 *     tags: [AAA]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset token
 *         example: "abcdefg"
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is valid"
 *       404:
 *         description: Token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Token is invalid"
 *
 *       500:
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Error occurred!"
 */
