/**
 * @swagger
 * /users/api-key:
 *   post:
 *     summary: Generate new API key.
 *     tags: [Users]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *
 *     responses:
 *       200:
 *         description: User apikey has been changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: "93b25766c93c1be23e6a065556f39af391b138e334a4eccb5c5a8f30bd36392e"
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Something happened
 */
