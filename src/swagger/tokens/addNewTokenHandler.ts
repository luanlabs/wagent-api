/**
 * @swagger
 * /tokens/:
 *   post:
 *     summary: Adding a new token.
 *     tags: [Tokens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *                 required: true
 *                 example : usdt
 *               logo:
 *                 type: string
 *                 required: true
 *                 example : https://logo.jpg
 *
 *     responses:
 *       201:
 *         description:  The token was saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The token was saved successfully
 *
 *       400:
 *         description: The token is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The token is available
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
 *                     example: Failed to save new token
 */
