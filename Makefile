.PHONY: ngrok

ngrok:
	ngrok http 8900

nodemon:
	node_modules/.bin/nodemon src/index.js localhost 8900
