const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Knowledge C0d3r API',
			version: '1.0.0',
			description: 'API de gerenciamento do sistema knowledge-c0d3r',
		},
		servers: [
			{
				url: 'http://localhost:3000',
			},
		],
	},
	apis: ['./config/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app) {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = swaggerDocs
