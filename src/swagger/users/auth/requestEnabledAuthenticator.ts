/**
 * @swagger
 * /users/auth/authenticator:
 *   post:
 *     summary: Request Enable Authenticator
 *     tags: [AAA]
 *     description: Allows a user to request a enable authenticator.
 *     parameters:
 *       - name: authorization
 *         in: headers
 *         description: JWT Token (Required if using tools other than Swagger UI.)
 *         required: false
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Atuhenticator secret created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Send request enable Authenticator successfull
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
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
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
