const Requests = require('../../requests/requestModel');

const validateRequestReplies = async (req, res, next) => {
  const { id } = req.params;
  const { profile_id, replies } = req.body;

  const request = Requests.getRequestDetailed(id);

  if (!request.id) {
    res.status(404).json({ error: 'Could not find a request with that id' });
  }

  if (!profile_id) {
    res.status(400).json({ error: 'Must include a profile id' });
  }

  replies.forEach(({ question_id, content }) => {
    if (!question_id) {
      res.status(400).json({ error: 'Every reply must include a question id' });
    }

    if (!content) {
      res
        .status(400)
        .json({ error: 'Every reply must include a content value' });
    }
  });

  next();
};

module.exports = {
  validateRequestReplies,
};
