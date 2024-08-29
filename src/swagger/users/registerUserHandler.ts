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
 *                 example: example@email.com
 *               name:
 *                 type: string
 *                 required: true
 *                 description: The name of the user or store.
 *                 example: BigShop
 *               password:
 *                 type: string
 *                 required: true
 *                 example: 12345678
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
 *       400:
 *         description: Validation failed or user already exists.
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
 *                       example: User already exists
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
 *                   example: Failed to save new user
 */