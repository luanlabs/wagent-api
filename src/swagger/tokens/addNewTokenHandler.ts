/**
 * @swagger
 * /tokens/:
 *   post:
 *     summary: Adding a new token.
 *     tags: [Tokens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *                 required: true
 *                 example : GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ
 *               logo:
 *                 type: string
 *                 required: true
 *                 example : https://logo.jpg
 *
 *     responses:
 *       201:
 *         description:  The token was saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: {
 *                       _id: "66a73cb095779d04d42b0949",
 *                       address: "GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ",
 *                       symbol: "usdt",
 *                       logo: "https://logo.jpg",
 *                       isActive: true,
 *                       __v: 0
 *                   }
 *
 *       400:
 *         description: Token already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token already exists
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
 *                     example: Failed to save new token
 */
