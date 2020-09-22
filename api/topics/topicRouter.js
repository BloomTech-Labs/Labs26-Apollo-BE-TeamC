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
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Request or Topic Iteration:
 *      type: object
 *      required:
 *        - context_responses
 *        - topic_questions
 *      properties:
 *        id:
 *          type: integer
 *          description: the ID of the newly created request
 *        topic_id:
 *          type: integer
 *          description: the ID of the topic you're creating an iteration from
 *        posted_at:
 *          type: string/date/timeStamp
 *        context_responses:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              context_question:
 *                type: string
 *              context_response:
 *                type: string
 *        topic_questions:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
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
 */

/**
 * @swagger
 * /topic/:
 *  post:
 *    description: Returns Topic and Topic Information.
 *    summary: Post a Topic!
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    responses:
 *      201:
 *        description: Needed information to post a topic, Returns topic Information. By sending up - "created_by", "title", "frequency", "context_questions", "default_questions", a new topic will be formed!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Topic'
 *              example:
 *                - created_by: '00uhjfrwdWAQvD8JV4x6'
 *                  title: "Topic Name"
 *                  frequency: "Daily"
 *                  context_questions: ["Question 1", "Question 2", "Question 3"]
 *                  default_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

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

/**
 * @swagger
 * /topic/{id}:
 *  get:
 *    description: By passing in a "topic id" as id, it will return the topic and details
 *    summary: Get a singular topic
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    responses:
 *      200:
 *        description:
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
 *
 */

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then((topic) => {
      if (topic.id) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'there are no topics here.' });
      }
    })
    .catch((error) => {
      console.log('Error getting topic', error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

router.post('/:id/join', (req, res) => {
  const id = req.params.id;
  const profileId = req.body.profile_id;
  db.addMemberToTopic(id, profileId)
    .then(() => {
      res
        .status(200)
        .json({ message: `Added Member ${profileId} the Topic ${id}.` });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/**
 * @swagger
 * /topic/{topicId}/request:
 *  post:
 *    description: Used for creating an Iteration or a "Request" for users to join in on and answer questions.
 *    summary: Create a Request!
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    responses:
 *      201:
 *        description: Needed information to post a request, Returns request Information.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Topic'
 *              example:
 *                  - topic_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *                    context_responses: [{id: 1, content: "Response"}, {id: 2, content: "Response"}, {id: 3, content: "Response"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

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

/**
 * @swagger
 * /topic/request/{requestId}:
 *  get:
 *    description: Calling to this endpoint will allow the dashboard to fill up with Context Questions/Responses (left side of Hi-FI), And recently created Topic_questions.
 *    summary: Returns topic request for users to access!
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    responses:
 *      200:
 *        description:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Topic'
 *              example:
 *                - id: 5
 *                  topic_id: 1
 *                  posted_at: "2020-09-16T20:40:42.319Z"
 *                  context_responses: [{context_question: "Question Text", context_response: "response"}, {context_question: "Question Text", context_response: "response"}, {context_question: "Question Text", context_response: "response"}]
 *                  topic_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *
 */

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

module.exports = router;
