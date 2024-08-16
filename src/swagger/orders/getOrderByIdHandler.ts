/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Fetching order with ID.
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: string
 *           example: 66b0a00e8fcfdccc8927589d
 *
 *     responses:
 *       200:
 *         description:  Order retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                             _id: "66b0a00e8fcfdccc8927589d",
 *                             user: {
 *                                 _id: "66b09fb68fcfdccc89275896",
 *                                 storeName: "shop",
 *                                 email: "example@email.com",
 *                                 isVerified: true,
 *                                 apiKey: "501af18b431cc3d93c1934cdade79dc3298911f78dfa1cf8db2da6b39057f645",
 *                                 createdAt: "2024-08-05T09:47:34.956Z",
 *                                 updatedAt: "2024-08-05T09:47:34.956Z",
 *                             },
 * 		                       products: [{
 *				                   _id: "66bd11ef8fcab0df67da19a9"
 *				                   name: "kir",
 *				                   logo: "kkk",
 *				                   amount: "3",
 *			                   }],
 *                             callbackApiUrl: "http://api.example.com",
 *                             redirectUrl: "http://example.com",
 *                             createdAt: "2024-08-05T09:47:34.956Z",
 *                             updatedAt: "2024-08-05T09:47:34.956Z"
 *                         }
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
 *                     example: Failed to get order
 */
