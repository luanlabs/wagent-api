/**
 * @swagger
 * /users/transactions/{id}:
 *   get:
 *     summary: Fetching transaction with ID.
 *     tags: [Users (Transactions)]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Transaction ID
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *       - name: Authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         id: "2",
 *                         productName: "Mobile",
 *                         method: "stream",
 *                         status: "active",
 *                         sender: "GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ",
 *                         createdAt: "2024-07-04T13:39:37.379+00:00",
 *                         cancelableAfter: "14400",
 *                         progress: 65,
 *                         amount: 23,
 *                         token: "usdt",
 *                      }
 *
 *       404:
 *         description: Transaction not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not exist
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
