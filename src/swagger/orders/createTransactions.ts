/**
 * @swagger
 * /orders/{id}/transactions:
 *   post:
 *     summary: Show User’s Order & Payment Options.
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: params
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: string
 *           example: akfdbkghk4434re
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hash:
 *                 type: string
 *                 example: 3rk4tkbnk4kj
 *
 *               payerEmail:
 *                 type: string
 *                 required: false
 *                 example: example@gmail.com
 *
 *     responses:
 *       200:
 *         description: Transaction has been submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                             id: "49574974fkdhfjkdk",
 *                             hash: "fhkfb49t5t4hrk",
 *                             payerEmail: "example@gmail.com",
 *                             submittedAt: 1725314912575,
 *                             order: {},
 *                             token: {}
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
 *                     example: Failed
 */
