const Profiles = require('../../profile/profileModel');

// Validates values in Topic POST Request
const validateTopicBody = async (req, res, next) => {
  const {
    created_by,
    title,
    frequency,
    context_questions,
    default_questions,
  } = req.body;

  const requestFrequencies = ['Daily', 'Weekly', 'Monthly'];
  const responseTypes = ['Rating', 'String', 'Url', 'Boolean'];

  if (!created_by || !title) {
    return res
      .status(400)
      .json({ error: 'Topic must include created_by and title values' });
  }

  const topic_creator = await Profiles.findById(created_by);

  if (!topic_creator) {
    return res
      .status(404)
      .json({ error: 'Could not find user with id in database' });
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
        .json({ error: 'Each context question must have content value' });
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

// TODO
const validateRequestBody = async (req, res, next) => {
  return null;
};

module.exports = {
  validateTopicBody,
  validateRequestBody,
};
