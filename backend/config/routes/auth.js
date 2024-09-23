
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operações de autenticação de usuário
 *   - name: Users
 *     description: Gerenciamento de usuários
 *   - name: Categories
 *     description: Gerenciamento de categorias
 *   - name: Articles
 *     description: Gerenciamento de artigos
 *   - name: Stats
 *     description: Estatísticas
 */

module.exports = app => {

    /**
     * @swagger
     * /sign-up:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Authentication]
     *     requestBody:
     *       description: Informações do novo usuário
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               confirm_password:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Erro na requisição
     */
    app.post('/sign-up', app.api.user.save)

    /**
     * @swagger
     * /sign-in:
     *   post:
     *     summary: Autentica o usuário
     *     tags: [Authentication]
     *     requestBody:
     *       description: Credenciais do usuário
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Usuário autenticado
     *       401:
     *         description: Credenciais inválidas
     */
    app.post('/sign-in', app.api.auth.signIn)

    /**
     * @swagger
     * /validate-token:
     *   post:
     *     summary: Valida o token JWT
     *     tags: [Authentication]
     *     responses:
     *       200:
     *         description: Token válido
     *       401:
     *         description: Token inválido
     */
    app.post('/validate-token', app.api.auth.validateToken)
}
