/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: Register New User.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 example : example@email.com
 *               storeName:
 *                 type: string
 *                 required: true
 *                 example : BigShop
 *               password:
 *                 type: string
 *                 required: true
 *                 example : 12345678
 *
 *     responses:
 *       201:
 *         description: Successful user registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         id: "16",
 *                         email: "example@email.com",
 *                         storeName: "BigShop",
 *                         storeImage: "",
 *                         token: "Bearer jqndwjsidbfwbeyribi..."
 *                      }
 *
 *       400:
 *         description: Such a user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Already Exist!
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
 *                     example: Failed to save new user
 */
