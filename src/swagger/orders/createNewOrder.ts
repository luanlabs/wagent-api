/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Show User’s Order & Payment Options.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 required: true
 *                 example : ak238tnhcyu2rh7i2t6bc2nbeiy23cge76rb372cn77rcg2
 *               callbackApiUrl:
 *                 type: string
 *                 required: true
 *                 example : http://api.example.com
 *               redirectUrl:
 *                 type: string
 *                 required: true
 *                 example : http://example.com
 *
 *     responses:
 *       200:
 *         description:  Payment retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         id: 5
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
 *                     example: Failed to get payment
 */
