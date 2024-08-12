/**
 * @swagger
 * /tokens/:
 *   get:
 *     summary: Fetching all tokens in the DB.
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
 *                       _id: "66a73cb095779d04d42b0949",
 *                       address: "GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ",
 *                       symbol: "usdt",
 *                       logo: "https://logo.jpg",
 *                       isActive: true,
 *                       __v: 0
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
