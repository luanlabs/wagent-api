/**
 * @swagger
 * /orders/{id}/payment:
 *   post:
 *     summary: Show User’s Order & Payment Options.
 *     tags: [Orders]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 required: true
 *                 example : GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ
 *               method:
 *                 type: string
 *                 required: true
 *                 example : single
 *                 enum:
 *                   - single
 *                   - stream
 *                   - vesting
 *               network:
 *                 type: string
 *                 required: true
 *                 example : soroban
 *                 enum:
 *                   - soroban
 *                   - stellar
 *               token:
 *                 type: string
 *                 required: true
 *                 example : Usdt
 *               email:
 *                 type: string
 *                 required: true
 *                 example : example@email.com
 *
 *     responses:
 *       200:
 *         description:  Payment retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         order: {
 *                             id: "20",
 *                             totalAmount: 1000,
 *                             products: [{
 *                                id: "5",
 *                                name: "Mobile",
 *                                method: "single",
 *                                token: [{ symbol: "USDT" }],
 *                                amount: 25,
 *                             },],
 *                         },
 *                         paymentSuccess: true,
 *                      }
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
 *                     example: Failed to get payment
 */
