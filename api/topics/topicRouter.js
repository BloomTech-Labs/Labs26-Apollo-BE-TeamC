const express = require('express');
// const authRequired = require('../middleware/authRequired');
const db = require('./topicModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Topic:
 *      type: object
 *      required:
 *        - created_by
 *        - title
 *        - frequency
 *        - context_questions
 *        - default_questions
 *      properties:
 *        created_by:
 *          type: string
 *          description: This is a foreign key (the okta user ID)
 *        title:
 *          type: string
 *        frequency:
 *          type: string
 *        context_questions:
 *          type: array
 *          items:
 *            type: string
 *        default_questions:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *              response_type:
 *                type: string
 *      example:
 *        created_by: '00uhjfrwdWAQvD8JV4x6'
 *        title: "Development Team"
 *        frequency: "Daily"
 *        context_questions: ["Question 1", "Question 2", "Question 3"]
 *        default_questions: ["Question 1", "Question 2", "Question 3"]
 *
 * /topic/{id}:
 *  get:
 *    description: Returns topic and details
 *    summary: Get a topic
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    responses:
 *      200:
 *        description: array of profiles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Topic'
 *              example:
 *                - created_by: '00uhjfrwdWAQvD8JV4x6'
 *                  title: "Development Team"
 *                  frequency: "Daily"
 *                  context_questions: ["Question 1", "Question 2", "Question 3"]
 *                  default_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

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
