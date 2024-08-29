/**
 * @swagger
 * /users/auth/reset:
 *   post:
 *     summary: Request Password Reset
 *     tags: [Users]
 *     description: Allows a user to request a password reset. Users can only request a reset once every 15 minutes.
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
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset password email was sent
 *       400:
 *         description: Validation failed.
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
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request reset password failed to complete
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User not found
 *                     extras:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *       429:
 *         description: Too many requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You can only request a password reset every 15 minutes.
 *       500:
 *         description: Error occurred.
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
 *                       example: Error occurred!
 *                     code:
 *                       type: integer
 *                       example: 500
 */