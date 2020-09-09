const express = require('express');
const authRequired = require('../middleware/authRequired');
const Profiles = require('./profileModel');
const db = require('./topicModel');
const dbConfig = require('../../data/db-config');
const router = express.Router();

router.get('/', (req, res) => {
  db.findAllTopics()
    .then((topics) => {
      res.status(200).json(topics);
    })
    .catch((error) => {
      console.log('Error getting topics', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

module.exports = router;
