const express = require('express');
// const authRequired = require('../middleware/authRequired');
const db = require('./topicModel');
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
      if (topic.id) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'there are no topics here!' });
      }
    })
    .catch((error) => {
      console.log('Error getting topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

router.get('/request/:reqId', (req, res) => {
  const requestId = req.params.reqId;
  db.getTopicRequestDetailed(requestId).then((requestInfo) => {
    if (requestInfo) {
      res.status(200).json(requestInfo);
    } else {
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    }
  });
});

//posts
router.post('/', (req, res) => {
  const topicInfo = req.body;

  db.addTopic(topicInfo)
    .then((topic) => {
      console.log(topic);
      res.status(201).json(topic);
    })
    .catch((error) => {
      console.log('Error Posting Topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

router.post('/:topicId/request', (req, res) => {
  const topicId = req.params.topicId;
  const { topic_questions, context_responses } = req.body;
  db.createIteration(topicId, topic_questions, context_responses)
    .then((request) => {
      res.status(201).json(request);
    })
    .catch((error) => {
      console.log('Error Posting Topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

module.exports = router;
