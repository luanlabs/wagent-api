/**
 * @swagger
 * /users/notification:
 *   post:
 *     summary: Sets a push notification token in the database for a user
 *     tags: [Users]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abcdefghhi"
 *     responses:
 *       200:
 *         description: Notification token has been set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification token has been set
 *       400:
 *         description: Token already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token already registered
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
