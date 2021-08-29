'use strict';

const express = require('express');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');

const app = express();
const port = 3000;
const source = 'source/'

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/*
  1) Upload the image
  2) Process the image
    2a) Send request to lamp
  3) Delete the image
*/
app.post('/upload', async (req, res) => {
  if (!fs.existsSync(source)) {
    fs.mkdirSync(source);
  }

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
