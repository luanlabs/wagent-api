/**
 * @swagger
 * /users/auth/reset:
 *   put:
 *     summary: Reset password with a new one using the received reset token from email
 *     tags: [AAA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *                 example: "abcd1234"
 *               password:
 *                 type: string
 *                 required: true
 *                 example: "Ab@1234567"
 *     responses:
 *       200:
 *         description: Password has been reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset"
 *       404:
 *         description: Invalid or expired token
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
 *                       example: "Invalid or expired token"
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
