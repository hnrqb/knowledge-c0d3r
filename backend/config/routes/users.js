const admin = require('../admin')

module.exports = app => {
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retorna todos os usuários
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Lista de usuários
     *       403:
     *         description: Acesso negado
     */
    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(app.api.user.get)

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retorna um usuário por ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Dados do usuário
     *       404:
     *         description: Usuário não encontrado
     */
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))
}