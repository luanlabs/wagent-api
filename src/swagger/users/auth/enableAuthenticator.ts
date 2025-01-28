/**
 * @swagger
 * /users/auth/authenticator:
 *   put:
 *     summary: Request Enable Authenticator
 *     tags: [AAA]
 *     description: Allows a user to enable authenticator.
 *     parameters:
 *       - name: authorization
 *         in: headers
 *         description: JWT Token (Required if using tools other than Swagger UI.)
 *         required: false
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
 *               tokne:
 *                 type: string
 *                 maximum: 6
 *                 example: 234765
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Enable authenticator successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Enable authenticator successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     isVerify:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Atuhenticator secret already.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already enabled authenticator
 *                 result:
 *                   type: object
 *                   properties:
 *                     isVerify:
 *                       type: boolean
 *                       example: false
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
