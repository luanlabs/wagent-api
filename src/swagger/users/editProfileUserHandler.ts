/**
 * @swagger
 * /users/{id}/settings:
 *   put:
 *     summary: Edit Profile & Settings.
 *     tags: [Users]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer JWT_ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 required: true
 *                 properties:
 *                   methods:
 *                     type: number
 *                     required: true
 *                     example : 1
 *                   tokens:
 *                     type: array
 *                     required: true
 *                     items:
 *                       type: object
 *                       properties:
 *                         symbol:
 *                           type: string
 *                           example: usdt
 *                   minimumCancellableStreamDuration:
 *                     type: number
 *                     example: 25
 *                   isSubscribed:
 *                     type: boolean
 *                     example: true
 *               profile:
 *                 type: object
 *                 required: true
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Jac
 *                   logoSrc:
 *                     type: string
 *                     example: https://image.com
 *
 *
 *     responses:
 *       201:
 *         description: Successful editing of the profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                     type: object
 *                     example: {
 *                         success: true
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
 *                     example: Failed to edit profile
 */
