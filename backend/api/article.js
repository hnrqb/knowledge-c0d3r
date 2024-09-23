const queries = require('./queries')

module.exports = app => {
    
    const { existsOrError, isValidIntegerOrError } = app.api.validation

    const save = async (req, res) => {

        const article = { ...req.body }

        if (req.params.id) article.id = req.params.id
        
        try {
            existsOrError(article.name, 'Nome não informado.')
            existsOrError(article.content, 'Conteúdo não informado.')
            existsOrError(article.description, 'Descrição não informada.')
            existsOrError(article.category_id, 'Categoria não informada.')
            existsOrError(article.user_id, 'Autor não informado.')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (article.id) {
            app.database('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.database('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const article_id = parseInt(req.params.id) || req.params.id
            
            try {
                isValidIntegerOrError(article_id, `O valor '${article_id}' não é um número inteiro válido.`)
            } catch (err) {
                return res.status(400).send(err)
            }

            const rowsDelete = await app.database('articles')
                .where({id: article_id}).del()
        
            try {
                existsOrError(rowsDelete, 'Artigo não encontrado.')
            } catch (err) {
                return res.status(400).send(err)
            }
            
            res.status(204).send()
        } catch (err) {
            res.status(500).send(err)
        }
    }

    const pagination_limit = 3
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.database('articles').count('id').first()
        const count = parseInt(result.count)

        app.database('articles')
            .select('id', 'name', 'description')
            .limit(pagination_limit).offset(page * pagination_limit - pagination_limit)
            .then(articles => res.json({ articles: articles, count, pagination_limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        
        const article_id = parseInt(req.params.id) || req.params.id

        try {

            isValidIntegerOrError(article_id, `O valor '${article_id}' não é um número inteiro válido.`)

            await app.database('articles')
                .where({id: article_id}).first()
                .then(article => existsOrError(article, 'Artigo não encontrado.'))
                .catch(err => res.status(404).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }

        app.database('articles')
            .where({ id: article_id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {

        const category_id = req.params.id
        const page = req.query.page || 1
        const categories = await app.database.raw(queries.categoryWithChild, category_id)
        const ids = categories.rows.map(category => category.id)

        app.database({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.image_url', { author: 'a.name'} )
            .limit(pagination_limit).offset(page * pagination_limit - pagination_limit)
            .whereRaw('?? = ??', ['u.id', 'a.user_id'])
            .whereIn('category_id', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}