/**
 * @swagger
 * /users/subscribe:
 *   post:
 *     summary: Subscribe or unsubscribe a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token of the user to modify the subscription status.
 *                 example: "5135564e0d0f32ad99a89040cf6569b95994e6c9c9a19dc90121d15f4ac6bdb5"
 *               subscribe:
 *                 type: boolean
 *                 description: Pass `true` to subscribe or `false` to unsubscribe the user.
 *                 example: true
 *     responses:
 *       200:
 *         description: User subscription status modified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User subscribed successfully"
 *       400:
 *         description: Bad request due to missing or invalid user token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User token is required"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to handle subscription"
 */
