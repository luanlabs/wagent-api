/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: Register a new user
 *     tags: [AAA]
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
 *                 example: example@gmail.com
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The name of the user or store.
 *                 example: MyShop
 *               password:
 *                 type: string
 *                 required: true
 *                 example: Aa@123455678
 *                 description: A password combination of letters numbers and symbols
 *
 *     responses:
 *       201:
 *         description: Successful user registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification email was sent
 *
 *       401:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration failed
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User already exists
 *
 *
 *       400:
 *         description: Registration failed because of validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Something is missing
 *                     extras:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: string
 *                             example: email
 *                           message:
 *                             type: string
 *                             example: Invalid email address
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
 *                   example: Failed to login user
 */
