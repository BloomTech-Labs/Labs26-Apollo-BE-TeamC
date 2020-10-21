const express = require('express');
const Profiles = require('../profile/profileModel');
// const authRequired = require('../middleware/authRequired');

const Topics = require('./topicModel');
const {
  validateTopicBody,
  validateRequestBody,
} = require('../middleware/topics/');

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
 * /topics/:
 *  post:
 *    description: Returns Topic and Topic Information.
 *    summary: Post a Topic!
 *    tags:
 *      - topic
 *    responses:
 *      201:
 *        description: Needed information to post a topic, Returns topic Information. By sending up "title", "frequency", "context_questions", "default_questions", a new topic will be formed! ----------- FREQUENCY* HAS TO BE "Daily", "Weekly" or "Monthly" ------------- RESPONSE_TYPE* HAS TO BE "Rating", "String", "Url" or "Boolean" Correct spelling and casing.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                - title: "Topic Name"
 *                  frequency: "Daily"
 *                  context_questions: ["Question 1", "Question 2", "Question 3"]
 *                  default_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *                  topic_iteration_requests: []
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

//posts
router.post('/', validateTopicBody, (req, res) => {
  const topicInfo = req.body;
  const created_by = req.profile.id;

  Topics.addTopic({ ...topicInfo, created_by })
    .then((topic) => {
      res.status(201).json(topic);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `We are sorry, Internal server error, ${error}` });
    });
});

/**
 * @swagger
 * /topics/:
 *  get:
 *    description: Calling this endpoint returns an object with 2 arrays in it, joined[] and created[].
 *    summary:  Returns created and joined topics.
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
 *              type: object
 *              example:
 *                - { myTopics: { created: [{id: 1, created_by: "00ult", frequency: "Daily", title: "Dev Team"}, {id: 2, created_by: "00ult", frequency: "Weekly", title: "FrontEnd"}], joined: [{topic_id: 1, title: "Dev Team"}] } }
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *
 */

//gets
router.get('/', (req, res) => {
  const id = req.profile.id;
  Profiles.findJoinedTopics(id).then((joinedTopics) => {
    Profiles.findCreatedTopics(id)
      .then((createdTopics) => {
        res
          .status(200)
          .json({ myTopics: { created: createdTopics, joined: joinedTopics } });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: `We are sorry, Internal server error, ${error}` });
      });
  });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    topicId:
 *      name: id
 *      in: path
 *      description: ID of the topic to display individual topics.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /topics/{id}:
 *  get:
 *    description: By passing in a "topic id" as id, it will return the topic and details
 *    summary: Get a singular topic
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    parameters:
 *      - $ref: '#/components/parameters/topicId'
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
 *                  members: [{"id": "00ulthapbErVUwVJy4x6", "name": "Bobby Gondola", "avatarUrl": "https://s3.amazonaws.com/uifaces/faces/twitter/codysanfilippo/128.jpg"}]
 *                  context_questions: ["Question 1", "Question 2", "Question 3"]
 *                  default_questions: [{content: "Question 1", response_type: "String"}, {content: "Question 2", response_type: "String"}, {content: "Question 3", response_type: "String"}]
 *                  topic_iteration_requests: [{"id": 1, "posted_at": "2020-09-28T00:37:22.873Z"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *
 */

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Topics.findById(id)
    .then((topic) => {
      if (topic.id) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: 'there are no topics here.' });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `We are sorry, Internal server error, ${error}` });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    topicId:
 *      name: id
 *      in: path
 *      description: ID of the topic that you want to join.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /topics/{topicId}/join:
 *  post:
 *    description: Used for adding the Users_Id to the Topic's Members List.
 *    summary: Add the user to the Topic's Members List!
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    parameters:
 *      - $ref: '#/components/parameters/topicId'
 *    responses:
 *      200:
 *        description: the response from a successful post to the endpoint.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                  - message: "Added Member {id} the Topic {topicId}."
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

router.post('/:id/join', async (req, res) => {
  const id = req.params.id;
  const profileId = req.profile.id;

  const topicMembers = await Topics.getTopicMembers(id);
  const topic = await Topics.findById(id);

  if (!topic.id) {
    return res
      .status(400)
      .json({ message: 'There is no topic with that join code' });
  }

  if (topic.created_by === profileId) {
    return res
      .status(400)
      .json({ message: 'Creator of topic cannot join as member' });
  }

  for (const member of topicMembers) {
    if (member.id === profileId) {
      return res
        .status(400)
        .json({ message: 'Member has already joined topic' });
    }
  }

  Topics.addMemberToTopic(id, profileId)
    .then(() => {
      res
        .status(200)
        .json({ message: `Added Member ${profileId} the Topic ${id}.` });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `We are sorry, Internal server error, ${error}` });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    topicId:
 *      name: id
 *      in: path
 *      description: ID of the topic that you want to join.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /topics/{topicId}/request:
 *  post:
 *    description: Used for creating an Iteration or a "Request" for users to join in on and answer questions.
 *    summary: Create a Request!
 *    security:
 *      - okta: []
 *    tags:
 *      - topic
 *    parameters:
 *      - $ref: '#/components/parameters/topicId'
 *    requestBody:
 *      description: Data to send up. Must include all the data below to reply to create a request.
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              example:
*                  - {
  "topic_questions" : [
    {
        "content": "What did you accomplish yesterday?",
        "response_type": "string"
    },
    {
        "content": "Why are you alive man?",
        "response_type": "string"
    },
    {
        "content": "Have you seen my dog?",
        "response_type": "string"
    }
  ],
  "context_responses": [
        {
            "id" : 1,
            "content": "Get something deployed"
        },
        {
            "id": 2,
            "content": "Get something returning"
        },
        {
            "id": 3,
            "content": "We have a nice dmo coming up! be ready"
        }
    ]
}
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

router.post('/:topicId/request', validateRequestBody, (req, res) => {
  const topicId = req.params.topicId;
  const { topic_questions, context_responses } = req.body;
  Topics.createIteration(topicId, topic_questions, context_responses)
    .then((request) => {
      res.status(201).json(request);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `We are sorry, Internal server error, ${error}` });
    });
});

module.exports = router;
