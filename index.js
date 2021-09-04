'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path')
const multer  = require('multer');
const { createCanvas, Image } = require('canvas');

const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');

const app = express();
const port = 3000;

const source = 'source/';
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const storage = multer.diskStorage({
    destination: source,
    filename: function(req, file, cb) {
	    cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/*
  1) Upload the image
  2) Process the image
    2a) Send request to lamp
  3) Delete the image
*/
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!fs.existsSync(source)) {
    fs.mkdirSync(source);
  }
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: 513,
    multiplier: 0.75
  });
  const canvas = await pathToImageCanvas(req.file.path);
  const input = tf.browser.fromPixels(canvas);
  const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
  console.log(pose);

  const result = drawSkeleton(canvas, pose);
  saveToFile(canvas);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//Helpers
const pathToImageCanvas = async (path) => {
    const img = new Image();
    img.src = path;
    const canvas = await createCanvas(img.width, img.height);
    const ctx = await canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
};

const drawSkeleton = async (canvas, pose) => {
  const ctx = await canvas.getContext('2d');
  const radius = 10;
  for (const keypoint of pose.keypoints) {
    ctx.beginPath();
    ctx.arc(keypoint.position.x, keypoint.position.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
  return canvas;
};

const saveToFile = (canvas) => {
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./output.png', buffer)
};
