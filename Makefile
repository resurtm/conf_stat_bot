.PHONY: default ngrok nodemon migrate create_migration reset_es_indices test_analytics

default:
	@echo "\navailable commands:\n\tngrok\n\tnodemon\n\tmigrate\n\tcreate_migration\n\treset_es_indices"
	@echo "\ttest_analytics\n"

ngrok:
	ngrok http 8900

nodemon:
	node_modules/.bin/nodemon src/index.js localhost 8900 --watch src

migrate:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:latest

create_migration:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:make $(name)

reset_es_indices:
	scripts/reset_es_indices.js

test_analytics:
	scripts/test_analytics.js
