const express = require('express');
// const authRequired = require('../middleware/authRequired');
// const Profiles = require('./profileModel');
const db = require('./topicModel');
// const dbConfig = require('../../data/db-config');
const router = express.Router();

//gets
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

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then((topic) => {
      // if (topic.length > 0) {
      res.status(200).json(topic);
      // } else {
      // res.status(404).json({ message: 'there are no topics here!' });
      // }
    })
    .catch((error) => {
      console.log('Error getting topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

//posts
router.post('/', (req, res) => {
  const info = req.body;
  db.addTopic(info)
    .then((info) => {
      console.log(info);
      res.status(201).json(info);
    })
    .catch((error) => {
      console.log('Error Posting Topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

router.post('/:id/context', (req, res) => {
  const context = req.body;
  const topicId = req.params.id;
  if (!context) {
    return res.status(400).json({ message: 'Must include context' });
  }
  db.addContext(context, topicId)
    .then((context) => {
      console.log(context);
      res.status(201).json(context);
    })
    .catch((error) => {
      console.log('Error Adding Context', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

module.exports = router;
