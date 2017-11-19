.PHONY: default ngrok nodemon run migrate create_migration reset_es_indices test_analytics test_analytics_chats

default:
	@echo "\navailable commands:\n\tngrok\n\tnodemon\n\trun\n\tmigrate\n\tcreate_migration\n\treset_es_indices"
	@echo "\ttest_analytics\n\ttest_analytics_chats\n"

ngrok:
	ngrok http 8900

nodemon:
	node_modules/.bin/nodemon src/index.js localhost 8900 --watch src

run:
	node src/index.js

migrate:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:latest

create_migration:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:make $(name)

reset_es_indices:
	scripts/reset_es_indices.js

test_analytics:
	scripts/test_analytics.js $(chat)

test_analytics_chats:
	scripts/test_analytics.js -1001262789346
	scripts/test_analytics.js -1001199864056
