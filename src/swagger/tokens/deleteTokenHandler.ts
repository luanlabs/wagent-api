/**
 * @swagger
 * /tokens/{symbol}:
 *   delete:
 *     summary: Deleting the token.
 *     tags: [Tokens]
 *     parameters:
 *       - name: symbol
 *         in: path
 *         description: Token symbol
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *
 *     responses:
 *       200:
 *         description: Token deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token deleted successfully"
 *
 *       400:
 *         description: Token not exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token not exists
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
 *                     example: Failed to delete token
 */
