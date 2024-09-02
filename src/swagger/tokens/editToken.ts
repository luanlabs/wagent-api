/**
 * @swagger
 * /tokens/{address}:
 *   put:
 *     summary: Changes the logo and other fields of a token
 *     tags: [Tokens]
 *     parameters:
 *       - name: symbol
 *         in: path
 *         description: Token symbol
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *       - name: authorization
 *         in: header
 *         description: JWT Token
 *         required: true
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
 *               logo:
 *                 type: string
 *                 required: true
 *                 example : https://bing.com/logo.jpg
 *
 *     responses:
 *       200:
 *         description: Token has been changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: {
 *                       address: "GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ",
 *                       symbol: "usdt",
 *                       logo: "https://bing.com/logo.jpg",
 *                   }
 *
 *       404:
 *         description: Token does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token does not exist
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
