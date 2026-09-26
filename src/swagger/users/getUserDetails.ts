/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user details using JWT token
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User details"
 *                 result:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: MyShop
 *
 *                     logo:
 *                       type: string
 *                       example: https://google.com/1.png
 *
 *                     email:
 *                       type: string
 *                       example: example@gmail.com
 *
 *                     address:
 *                       type: string
 *                       example: GBLUXDDBTGCLIC3TYAFYUJ5EO2MPXBSFMU7GHNLQ6IZWEJVXWMLBLUXX
 *
 *                     apiKey:
 *                       type: string
 *                       example: abcfhkfgh30rir4t5
 *
 *                     tokens:
 *                       type: string
 *                       example: todo
 *
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *
 *                     methods:
 *                       type: number
 *                       example: 5
 *
 *                     isSubscribed:
 *                       type: boolean
 *                       example: true
 *
 *                     minimumCancellableStreamDuration:
 *                       type: number
 *                       example: 0
 *
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
