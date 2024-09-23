const admin = require('../admin')

module.exports = app => {
    /**
     * @swagger
     * /articles:
     *   get:
     *     summary: Retorna todos os artigos
     *     tags: [Articles]
     *     responses:
     *       200:
     *         description: Lista de artigos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: O ID do artigo
     *                   title:
     *                     type: string
     *                     description: Título do artigo
     *   post:
     *     summary: Cria um novo artigo
     *     tags: [Articles]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               content:
     *                 type: string
     *     responses:
     *       201:
     *         description: Artigo criado com sucesso
    */
    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))

    /**
     * @swagger
     * /articles/{id}:
     *   get:
     *     summary: Retorna um artigo por ID
     *     tags: [Articles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID do artigo
     *     responses:
     *       200:
     *         description: Artigo encontrado
     *       404:
     *         description: Artigo não encontrado
     *   put:
     *     summary: Atualiza um artigo existente
     *     tags: [Articles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID do artigo
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               content:
     *                 type: string
     *     responses:
     *       200:
     *         description: Artigo atualizado com sucesso
     *   delete:
     *     summary: Remove um artigo
     *     tags: [Articles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID do artigo
     *     responses:
     *       204:
     *         description: Artigo removido com sucesso
     */
    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    /**
     * @swagger
     * /categories/{id}/articles:
     *   get:
     *     summary: Retorna artigos por categoria
     *     tags: [Articles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID da categoria
     *     responses:
     *       200:
     *         description: Lista de artigos da categoria
    */
    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

}
