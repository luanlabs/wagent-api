/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Sends a notification to a specified device using a provided token.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The device token to which the notification will be sent.
 *                 example: "fcm_token_example_123456"
 *               title:
 *                 type: string
 *                 description: The title of the notification.
 *                 example: "Important Update"
 *               body:
 *                 type: string
 *                 description: The body content of the notification.
 *                 example: "This is a notification message."
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   description: The result of the notification sending operation.
 *                   example:
 *                     messageId: "message_id_example"
 *                     success: true
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid input data"
 *       500:
 *         description: Internal server error while sending the notification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to send notification"
 */