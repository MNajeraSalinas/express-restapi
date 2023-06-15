const express = require('express');
const { ObjectId } = require('mongodb');

// router is an instance of the express router.
// The router will be added as a middleware and will take control of requests starting with path /posts.
const router = express.Router();

// Get a list of 20 posts
router.get('/', async (req, res) => {
  const db = await require('../db/mongodb').getDb();
  let collection = db.collection('posts');
  let results = await collection.find({}).limit(20).toArray();
  res.send(results).status(200);
});

// Get a single post
router.get('/:id', async (req, res) => {
  const db = await require('../db/mongodb').getDb();
  let collection = db.collection('posts');
  let _id;
  try {
    _id = new ObjectId(req.params.id);
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }
  let query = { _id };
  let result = await collection.findOne(query);

  if (!result) {
    res.status(404).send('Not found');
    return;
  }
  res.send(result).status(200);
});

router.post('/', async (req, res) => {
  const db = await require('../db/mongodb').getDb();
  let collection = db.collection('posts');
  const body = req.body;
  const post = {
    body: body.body,
    author: body.author,
    title: body.title,
  };
  const newObject = await collection.insertOne(post);
  res
    .send({
      message: `post inserted with Id: ${newObject.insertedId}`,
      post,
    })
    .status(200);
});

router.put('/:id', async (req, res) => {
  const db = await require('../db/mongodb').getDb();
  let collection = db.collection('posts');
  const body = req.body;
  let _id;
  try {
    _id = new ObjectId(req.params.id);
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }
  const post = {
    body: body.body,
    author: body.author,
    title: body.title,
  };
  const newObject = await collection.updateOne(
    { _id },
    { $set: post },
    { upsert: true }
  );
  res
    .send({
      message: `post updated with Id: ${newObject.upsertedId}`,
      post,
    })
    .status(200);
});

router.delete('/:id', async (req, res) => {
  const db = await require('../db/mongodb').getDb();
  let collection = db.collection('posts');
  let _id;
  try {
    _id = new ObjectId(req.params.id);
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }
  const deleted = await collection.deleteOne({ _id });
  res.send({ message: `post deleted: ${deleted.deletedCount}` }).status(200);
});

module.exports = router;
