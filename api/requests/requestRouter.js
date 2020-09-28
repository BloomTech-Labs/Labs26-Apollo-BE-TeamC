const router = require('express').Router();
const Requests = require('./requestModel');

/**
 * @swagger
 * components:
 *  schemas:
 *    postReplies:
 *      type: object
 *      required:
 *        - profile_id
 *        - replies
 *      properties:
 *        profile_id:
 *          type: string
 *        replies:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              question_id:
 *                type: integer
 *              content:
 *                type: string
 *      example:
 *        profile_id: '00uhjfrwdWAQvD8JV4x6'
 *        replies: [{question_id: 1, content: "String"}, {question_id: 2, content: "String"}, {question_id: 3, content: "String"}]
 */

/**
 * @swagger
 * components:
 *  parameters:
 *    requestId:
 *      name: id
 *      in: path
 *      description: ID of the request that you want to post replies to.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /requests/{requestId}:
 *  post:
 *    description: Posting to this endpoint posts replies to the questions associated with the request.
 *    summary: Posting to this endpoints adds replies to the request's questions.
 *    security:
 *      - okta: []
 *    tags:
 *      - requests
 *    parameters:
 *      - $ref: '#/components/parameters/requestId'
 *    requestBody:
 *      description: Data to send up. Must include all the data below to reply to request questions.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/postReplies'
 *    responses:
 *      201:
 *        description:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/201Replies'
 *              example:
 *                [{id: 1,
 *                  posted_at: 2020-09-28T00:37:22.901Z,
 *                  iteration_id: 1,
 *                  question_id: 1,
 *                  profile_id: 00ulthapbErVUwVJy4x6,
 *                  content: String,
 *                  name: String,
 *                  avatarUrl: String}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *
 */

router.post('/:id', (req, res) => {
  const { id } = req.params;
  const { profile_id, replies } = req.body;

  Requests.addRequestReplies(id, profile_id, replies).then((requestInfo) => {
    if (requestInfo) {
      res.status(200).json(requestInfo);
    } else {
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    }
  });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    requestId:
 *      name: id
 *      in: path
 *      description: ID of the request that you want to join.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /requests/{requestId}:
 *  get:
 *    description: Calling to this endpoint will allow the dashboard to fill up with Context Questions/Responses (left side of Hi-FI), And recently created Topic_questions.
 *    summary: Returns topic request for users to access!
 *    security:
 *      - okta: []
 *    tags:
 *      - requests
 *    parameters:
 *      - $ref: '#/components/parameters/requestId'
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

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Requests.getRequestDetailed(id).then((requestInfo) => {
    if (requestInfo) {
      res.status(200).json(requestInfo);
    } else {
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    }
  });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    requestId:
 *      name: id
 *      in: path
 *      description: ID of the request that you want to join.
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 * /requests/{requestId}/questions:
 *  get:
 *    description: Calling to this endpoint will return the questons associated with the request/iteration of the original topic.
 *    summary: Returns the questions associated with the request/iteration of the original topic.
 *    security:
 *      - okta: []
 *    tags:
 *      - requests
 *    parameters:
 *      - $ref: '#/components/parameters/requestId'
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
 *                [{id: 1, content: "String"}, {id: 2, content: "String"}, {id: 3, content: "String"}]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *
 */

router.get('/:id/questions', (req, res) => {
  const { id } = req.params;
  Requests.getRequestQuestions(id)
    .then((questions) => {
      res.status(200).json(questions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

router.get('/:id/replies', (req, res) => {
  const { id } = req.params;
  Requests.getRequestReplies(id)
    .then(async (replies) => {
      const status = await Requests.getMemberRepliedStatus(id, 1);
      const whoHasReplied = await Requests.getWhoHasReplied(id);

      const filteredReplies = whoHasReplied.reduce((acc, curr) => {
        let username;
        let userAvatarUrl;

        const foundReplies = replies
          .filter((reply) => reply.profile_id === curr)
          .map(
            ({
              id,
              posted_at,
              iteration_id,
              question_id,
              content,
              name,
              avatarUrl,
            }) => {
              if (!username) username = name;
              if (!userAvatarUrl) userAvatarUrl = avatarUrl;
              return {
                id,
                posted_at,
                iteration_id,
                question_id,
                content,
              };
            }
          );

        acc.push({
          profile_id: curr,
          name: username,
          avatarUrl: userAvatarUrl,
          replies: foundReplies,
        });

        return acc;
      }, []);

      res.status(200).json({
        request_replies: filteredReplies,
        member_reply_statuses: status,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

module.exports = router;
