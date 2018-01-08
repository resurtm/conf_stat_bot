.PHONY: default
default:
	@echo "no default action"

.PHONY: ngrok
ngrok:
	ngrok http 8900

.PHONY: nodemon
nodemon:
	node_modules/.bin/nodemon src/index.js localhost 8900 --watch src

.PHONY: run
run:
	node src/index.js

.PHONY: migrate
migrate:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:latest

.PHONY: rollback
rollback:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:rollback

.PHONY: create_migration
create_migration:
	node_modules/.bin/knex --knexfile=src/knexfile.js migrate:make $(name)

.PHONY: reset_es_indices
reset_es_indices:
	scripts/reset_es_indices.js

.PHONY: test_analytics
test_analytics:
	scripts/test_analytics.js $(chat)

.PHONY: test_analytics_chats
test_analytics_chats:
	scripts/test_analytics.js -1001262789346
	scripts/test_analytics.js -1001199864056

.PHONY: clear_logs
clear_logs:
	rm -rfv logs/*.log
