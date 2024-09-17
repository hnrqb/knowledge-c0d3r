const { authSecret }  = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const signIn = async (req, res) => {

        const email = req.body.email
        const password = req.body.password

        if (!email || !password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.database('users')
            .where({ email: email })
            .first()
            .then()

        if (!user) return res.status(400).send('Usuário não encontrado')

        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch) return res.status(401).send('E-mail/Senha inválidos!')
        
        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => { 

        try {

            const userData = req.body || null
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (err) {   
            // problema com o token
        }

        res.send(false)
    }

    return { signIn, validateToken }
}
