/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancel Order.
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: string
 *           example: akfdbkghk4434re
 *
 *     responses:
 *       200:
 *         description: Order cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     example: Order has been cancelled
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
 *                     example: Failed to get payment
 */
