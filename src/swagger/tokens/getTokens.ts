/**
 * @swagger
 * /tokens/:
 *   get:
 *     summary: Retrieves all tokens stored in the database
 *     tags: [Tokens]
 *
 *     responses:
 *       200:
 *         description: Tokens retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: [{
 *                       address: "GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ",
 *                       symbol: "usdt",
 *                       logo: "https://bing.com/logo.jpg",
 *                   },]
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
 *                     example: Failed to get tokens
 */
