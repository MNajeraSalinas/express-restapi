const express = require('express');
const { ObjectId } = require('mongodb');

// router is an instance of the express router.
// The router will be added as a middleware and will take control of requests starting with path /posts.
const router = express.Router();

const DB_NAME = 'sample_training';

// Get a list of 20 posts
router.get('/', async (req, res) => {
  const db = require('../db/connection').getDb(DB_NAME);
  let collection = await db.collection('posts');
  let results = await collection.find({}).limit(20).toArray();
  res.send(results).status(200);
});

// Get a single post
router.get('/:id', async (req, res) => {
  const db = require('../db/connection').getDb(DB_NAME);
  let collection = await db.collection('posts');
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

module.exports = router;
