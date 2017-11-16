const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(8900, () => console.log('App listening on 8900'));
