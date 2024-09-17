const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {

        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {

            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirm_password, 'Confirmação de Senha ou Senha Inválida')
            equalsOrError(user.password, user.confirm_password, 'Senhas não conferem')

            const userFromDB = await app.database('users')
                .where({ email: user.email })
                .first()

            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirm_password

        if (user.id) {
            app.database('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deleted_at')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.database('users')
                .insert(user)                
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const pagination_limit = 10
    const get = (req, res) => {

        const page = 1

        const result = app.database('users').count('id').first()
        const count = parseInt(result.count)

        app.database('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deleted_at')
            .limit(pagination_limit).offset(page * pagination_limit - pagination_limit)
            .then(users => res.json({ data: users, count, pagination_limit}))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {

        app.database('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deleted_at')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {

        try {
            const articles = await app.database('articles')
                .where({ user_id: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.database('users')
                .update({deleted_at: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove}
}