/**
 * @swagger
 * /users/products:
 *   post:
 *     summary: Add New Product.
 *     tags: [Users (Products)]
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
 *               name:
 *                 type: string
 *                 required: true
 *                 example : Mobile
 *               method:
 *                 type: string
 *                 required: true
 *                 example : single
 *                 enum:
 *                   - single
 *                   - stream
 *                   - vesting
 *               token:
 *                 type: array
 *                 required: true
 *                 items:
 *                   type: object
 *                   properties:
 *                     symbol:
 *                       type: string
 *                       example: usdt
 *               amount:
 *                 type: number
 *                 required: true
 *                 example : 25
 *
 *
 *     responses:
 *       201:
 *         description: Successful addition of the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         success: true
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
 *                     example: Failed to save new product
 */
