const Topics = require('../../topics/topicModel');

// Constant values
const requestFrequencies = ['Daily', 'Weekly', 'Monthly'];
const responseTypes = ['Rating', 'String', 'Url', 'Boolean'];

// Validates values in Topic POST Request
const validateTopicBody = async (req, res, next) => {
  const { title, frequency, context_questions, default_questions } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Topic must include title value' });
  }

  if (!frequency) {
    return res
      .status(400)
      .json({ error: 'Topic must include frequency value' });
  } else if (!requestFrequencies.includes(frequency)) {
    return res.status(400).json({
      error: 'The frequency value must be Daily, Weekly, or Monthly',
    });
  }

  if (!context_questions || !default_questions) {
    return res.status(400).json({
      error: 'Topic must include context_questions and default_questions',
    });
  }

  if (!context_questions.length) {
    return res.status(400).json({
      error:
        'Must have at least one context question in context_questions array',
    });
  }

  context_questions.forEach((question) => {
    if (!question) {
      return res
        .status(400)
        .json({ error: 'Each context question must have a content value' });
    }
  });

  default_questions.forEach(({ content, response_type }) => {
    if (!content || !response_type) {
      return res.status(400).json({
        error:
          'Each context question must have content and response_type values',
      });
    }
    if (!responseTypes.includes(response_type)) {
      return res.status(400).json({
        error:
          'Default question response_type must be Rating, String, Url, or Boolean',
      });
    }
  });

  next();
};

const validateRequestBody = async (req, res, next) => {
  const { topicId } = req.params;
  const { topic_questions, context_responses } = req.body;

  const topic = await Topics.findById(topicId);

  if (!topic.id) {
    return res.status(404).json({ error: 'Could not find topic with that id' });
  }

  if (!context_responses || !context_responses.length) {
    return res
      .status(400)
      .json({ error: 'Request must have context_responses' });
  }

  if (!topic_questions || !topic_questions.length) {
    return res.status(400).json({ error: 'Request must have topic_questions' });
  }

  for (const { id, content } of context_responses) {
    if (!id || !content) {
      return res.status(400).json({
        error: 'Each context response must have content and id values',
      });
    }
  }

  for (const { content, response_type } of topic_questions) {
    if (!content || !response_type) {
      return res.status(400).json({
        error: 'Topic question must have content and a response_type values',
      });
    }

    if (!responseTypes.includes(response_type)) {
      return res.status(400).json({
        error:
          'Topic question response_type must be Rating, String, Url, or Boolean',
      });
    }
  }

  next();
};

module.exports = {
  validateTopicBody,
  validateRequestBody,
};
