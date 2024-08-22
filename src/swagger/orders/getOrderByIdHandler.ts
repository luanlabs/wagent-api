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
 *                                 createdAt: "2024-08-05T09:47:34.956Z",
 *                                 updatedAt: "2024-08-05T09:47:34.956Z",
 *                             },
 *                             apiKey: {
 *                                 _id: "66b09fb78fcfdccc89275898",
 *                                 key: "93b25766c93c1be23e6a065556f39af391b138e334a4eccb5c5a8f30bd36392e",
 *                                 status: "active"
 *                             }
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
