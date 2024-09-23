const admin = require('../admin')

module.exports = app => {
    
    /**
     * @swagger
     * /categories:
     *   get:
     *     summary: Retorna todas as categorias
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorias
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: O ID da categoria
     *                     example: 1
     *                   name:
     *                     type: string
     *                     description: Nome da categoria
     *                     example: Tecnologia
     *   post:
     *     summary: Cria uma nova categoria
     *     tags: [Categories]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nome da categoria
     *     responses:
     *       201:
     *         description: Categoria criada com sucesso
     *       400:
     *         description: Erro na criação da categoria
     */
    app.route('/categories')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.category.save))
        .get(admin(app.api.category.get))

    /**
     * @swagger
     * /categories/tree:
     *   get:
     *     summary: Retorna a árvore de categorias
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Estrutura em árvore de categorias
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   description: ID da categoria
     *                   example: 1
     *                 name:
     *                   type: string
     *                   description: Nome da categoria
     *                   example: Tecnologia
     *                 children:
     *                   type: array
     *                   items:
     *                     type: object
     *                     description: Subcategorias
     */
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    /**
     * @swagger
     * /categories/{id}:
     *   get:
     *     summary: Retorna uma categoria por ID
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID da categoria
     *     responses:
     *       200:
     *         description: Categoria encontrada
     *       404:
     *         description: Categoria não encontrada
     *   put:
     *     summary: Atualiza uma categoria existente
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID da categoria
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nome da categoria
     *     responses:
     *       200:
     *         description: Categoria atualizada com sucesso
     *       400:
     *         description: Erro na atualização da categoria
     *   delete:
     *     summary: Remove uma categoria
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: O ID da categoria
     *     responses:
     *       204:
     *         description: Categoria removida com sucesso
     *       404:
     *         description: Categoria não encontrada
     */
    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))
   
}