module.exports = app => {
    const { existsOrError, notExistsOrError, isValidIntegerOrError } = app.api.validation

    const save = (req, res) => {
        const category = {
            name: req.body.name,
            parent_id: req.body.id !== req.body.parent_id ? req.body.parent_id : null
        }
        
        if (req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (category.id) {
            app.database('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.database('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            let category_id = parseInt(req.params.id)
            const categoryToDelete = await app.database('categories')
                .where({id: category_id}).first()

            existsOrError(categoryToDelete, 'Categoria não encontrada.')
            existsOrError(category_id, 'Código da Categoria não informado.')
            isValidIntegerOrError(category_id, `O valor '${category_id}' não é um número inteiro válido.`)

            const subCategories = await app.database('categories')
                .where({parent_id: category_id});
            notExistsOrError(subCategories, 'Categoria possui subcategorias.')

            const articles = await app.database('articles')
                .where({category_id: category_id});
            notExistsOrError(articles, 'Categoria possui artigos.')
            
            await app.database('categories')
                .where({id: category_id}).delete()

            res.status(204).send()

        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = categories => {

        const getParent = (categories, parent_id) => {
            const parent = categories.filter(parent => parent.id === parent_id)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parent_id)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parent_id)
            }
            
            return { ...category, path }
        })
        
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1   
            if(a.path > b.path) return 1
            return 0
        })
        
        return categoriesWithPath
    }

    const get = (req, res) => {
        app.database('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.database('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(category => !category.parent_id)
        tree = tree.map(parentNode => {
            const isChild = node => node.parent_id == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.database('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}