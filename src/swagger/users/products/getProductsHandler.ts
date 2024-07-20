/**
 * @swagger
 * /users/products:
 *   get:
 *     summary: Fetching the list of products.
 *     tags: [Users (Products)]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default 1)
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: [{
 *                         id: "5",
 *                         name: "Mobile",
 *                         method: "single",
 *                         token: [{ symbol: "USDT" }],
 *                         amount: 25,
 *                      },]
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
 *                     example: Failed to get products list
 */
