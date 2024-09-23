module.exports = app => {
    app.route('/stats')
    /**
     * @swagger
     * /stats:
     *   get:
     *     summary: Retorna estatísticas do sistema
     *     tags: [Stats]
     *     responses:
     *       200:
     *         description: Estatísticas do sistema retornadas com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 users:
     *                   type: integer
     *                   example: 100
     *                 categories:
     *                   type: integer
     *                   example: 20
     *                 articles:
     *                   type: integer
     *                   example: 150
     */
    .all(app.config.passport.authenticate())
    .get(app.api.stat.get)

}