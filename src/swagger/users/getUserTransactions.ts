/**
 * @swagger
 * /users/transactions:
 *   get:
 *     summary: Retrieves the transactions related to this user (merchant)
 *     tags: [Users]
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
 *
 *     responses:
 *       200:
 *         description: User transactions
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
 *                         example: "66f7148c2757a843f703de35"
 *
 *                       method:
 *                         type: number
 *                         example: 5
 *
 *                       payerEmail:
 *                         type: string
 *                         example: example@gmail.com
 *
 *                       payerAddress:
 *                         type: string
 *                         example: GAUQAPCGTQB7EJUZBSQ43YXDH4IXA3JIABNB43YPEEE564I3UQNHIAAP
 *
 *                       submittedAt:
 *                         type: number
 *                         example: 1725313694409
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
