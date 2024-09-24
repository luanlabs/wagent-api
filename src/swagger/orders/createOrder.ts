/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Creates an order and returns an id (pass either products or amount)
 *     tags: [Orders]
 *     parameters:
 *       - name: apiKey
 *         in: header
 *         description: API key
 *         required: true
 *         schema:
 *           type: string
 *           example: abdcdefg1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: object
 *                 required: false
 *                 example: [{
 *                   name: "a product",
 *                   logo: "https://bing.com/1.jpg",
 *                   amount: 123456,
 *                   count: 5
 *                 }]
 *               amount:
 *                 type: number
 *                 required: false
 *                 example: 12345
 *               redirectUrl:
 *                 type: string
 *                 required: true
 *                 example : http://example.com
 *
 *     responses:
 *       200:
 *         description: Order has been created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         id: "43ktrhgkfnfnd33"
 *                         url: "https://pay.wagent.app/43ktrhgkfnfnd33"
 *                      }
 *
 *       400:
 *         description: Both amount and products are not allowed OR Either amount or products is required
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Both amount and products are not allowed
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
