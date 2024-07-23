/**
 * @swagger
 * /users/transactions:
 *   get:
 *     summary: Fetching the list of transaction.
 *     tags: [Users (Transactions)]
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
 *         description: Transactions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: [{
 *                         id: "2",
 *                         products: [{
 *                             id: "5",
 *                             name: "Mobile",
 *                             method: "single",
 *                             token: [{ symbol: "USDT" }],
 *                             amount: 25
 *                         },],
 *                         method: "stream",
 *                         status: "active",
 *                         createdAt: "2024-07-04T13:39:37.379+00:00",
 *                         amount: 23,
 *                         token: "usdt",
 *                         },]
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
 *                     example: Failed to get transactions list
 */
