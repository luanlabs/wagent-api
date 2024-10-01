/**
 * @swagger
 * /users/:
 *   put:
 *     summary: Edits the user setting and profile
 *     tags: [Users]
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
 *               methods:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 example: 3
 *               minimumCancellableStreamDuration:
 *                 type: number
 *                 minimum: 1
 *                 example: 15
 *               tokens:
 *                 type: array
 *                 example: [
 *                    ""
 *                 ]
 *               isSubscribed:
 *                 type: boolean
 *                 example: true
 *               name:
 *                 type: string
 *                 example: "A New Name For My Shop"
 *               logo:
 *                 type: string
 *                 example: "https://google.com/1.jpg"
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User settings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User settings updated successfully
 *       400:
 *         description: Invalid settings data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid settings data
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
