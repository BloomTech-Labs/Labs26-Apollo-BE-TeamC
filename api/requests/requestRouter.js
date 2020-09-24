const router = require('express').Router();
const Requests = require('./requestModel');

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

        acc[curr] = {};

        acc[curr].replies = replies
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
              return { id, posted_at, iteration_id, question_id, content };
            }
          );
        if (!acc[curr].name) acc[curr].name = username;
        if (!acc[curr].avatarUrl) acc[curr].avatarUrl = userAvatarUrl;
        return acc;
      }, {});

      res.status(200).json({ filteredReplies, reply_status: status });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'We are sorry, Internal server error.' });
    });
});

module.exports = router;
