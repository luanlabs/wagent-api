/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Show User’s Order & Payment Options.
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: params
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: string
 *           example: akfdbkghk4434re
 *
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 3rk4tkbnk4kj
 *
 *                       amount:
 *                         type: number
 *                         required: true
 *                         example: 12345
 *                       redirectUrl:
 *                         type: string
 *                         required: true
 *                         example: "https://myshop.biz/123"
 *                       user:
 *                         type: object
 *                         example: {
 *                           name: "MyShop",
 *                           logo: "https://bing.com/1.jpg"
 *                         }
 *                       status:
 *                         type: string
 *                         required: true
 *                         example: pending
 *                         enum:
 *                           - pending
 *                           - completed
 *                           - expired
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
