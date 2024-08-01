/**
 * @swagger
 * /tokens/{symbol}:
 *   put:
 *     summary: Modifying the active tokens.
 *     tags: [Tokens]
 *     parameters:
 *       - name: symbol
 *         in: path
 *         description: Token symbol
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 required: true
 *                 example : https://logo.jpg
 *
 *     responses:
 *       200:
 *         description: Token modifyed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: {
 *                       _id: "66a73cb095779d04d42b0949",
 *                       symbol: "usdt",
 *                       logo: "https://logo.jpg",
 *                       isActive: true,
 *                       __v: 0
 *                   }
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
 *                     example: Failed to edit token
 */
