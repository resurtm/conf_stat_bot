.PHONY: ngrok nodemon migrate create_migration

ngrok:
	ngrok http 8900

nodemon:
	node_modules/.bin/nodemon src/index.js localhost 8900 --watch src

migrate:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:latest

create_migration:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:make $(name)
