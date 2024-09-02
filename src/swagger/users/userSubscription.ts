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
 *               userId:
 *                 type: string
 *                 description: The ID of the user to modify the subscription status.
 *                 example: "60d21bb67c0d8c6f6c3f4d8c"
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
 *         description: Bad request due to missing or invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
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
