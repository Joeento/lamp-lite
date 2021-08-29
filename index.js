'use strict';

const express = require('express');
const fs = require('fs');
const multer  = require('multer');
const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');

const app = express();
const port = 3000;
const source = 'source/';
const upload = multer({ dest: source });

const storage = multer.diskStorage({
    destination: source,
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

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
  console.log(req.file);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
