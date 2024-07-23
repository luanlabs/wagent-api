/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify JWT Token.
 *     tags: [Verify]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *                 example : "Bearer jqndwjsidbfwbeyribi..."
 *
 *     responses:
 *       200:
 *         description: Validity of the JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         valid: true
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
 *                     example: Failed to get Validity token
 */
