/**
 * @swagger
 * /tokens:
 *   post:
 *     summary: Creates a new token
 *     tags: [Tokens]
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
 *               symbol:
 *                 type: string
 *                 required: true
 *                 example: USDT
 *               logo:
 *                 type: string
 *                 required: true
 *                 example: https://bing.com/logo.jpg
 *               address:
 *                 type: string
 *                 required: true
 *                 example: GAUQAPCGTQB7EJUZBSQ43YXDH4IXA3JIABNB43YPEEE564I3UQNHIAAP
 *
 *     responses:
 *       201:
 *         description: Token has been created
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
 *                       logo: "https://bing.com/logo.jpg",
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
