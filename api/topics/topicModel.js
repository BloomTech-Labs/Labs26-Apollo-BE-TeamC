const db = require('../../data/db-config');

//gets
const findAllTopics = async () => {
  return await db('topics');
};

const getTopicMembers = async (topicId) => {
  return await db('topic_members_junction')
    .where({ topic_id: topicId })
    .join('profiles', 'profiles.id', 'topic_members_junction.member_id')
    .select('profiles.id', 'profiles.name');
};

const getTopicContexts = async (topicId) => {
  return await db('topic_context_junction')
    .where({ topic_id: topicId })
    .join(
      'topic_context_questions',
      'topic_context_junction.context_id',
      'topic_context_questions.id'
    )
    .select('topic_context_questions.id', 'topic_context_questions.content');
};

const getTopicDefaultQuestions = async (topicId) => {
  return await db('topic_default_questions')
    .where({ topic_id: topicId })
    .join(
      'topic_questions',
      'topic_questions.id',
      'topic_default_questions.question_id'
    )
    .select(
      'topic_questions.id',
      'topic_questions.content',
      'topic_questions.response_type'
    );
};

const getTopicIterations = async (topicId) => {
  return await db('topic_iteration')
    .where({ topic_id: topicId })
    .select('topic_iteration.id', 'topic_iteration.posted_at');
};

const findById = async (id) => {
  const topicInfo = await db('topics').where({ id }).first();
  const members = await getTopicMembers(id);
  const contexts = await getTopicContexts(id);
  const defaultQuestions = await getTopicDefaultQuestions(id);
  const iterations = await getTopicIterations(id);

  return { ...topicInfo, members, contexts, defaultQuestions, iterations };
};

//posts
const addContextsToTopic = async (context_questions, newTopicId) => {
  for (const context of context_questions) {
    const contextQuestion = await db('topic_context_questions')
      .where({ content: context })
      .first();

    if (contextQuestion) {
      await db('topic_context_junction').insert({
        topic_id: newTopicId,
        context_id: contextQuestion.id,
      });
    } else {
      const [contextQuestionId] = await db('topic_context_questions').insert(
        { content: context },
        'id'
      );
      await db('topic_context_junction').insert({
        topic_id: newTopicId,
        context_id: contextQuestionId,
      });
    }
  }
};

const addDefaultQuestionsToTopic = async (default_questions, newTopicId) => {
  for (const { content, response_type } of default_questions) {
    const defaultQuestion = await db('topic_questions')
      .where({ content, response_type })
      .first();

    if (defaultQuestion) {
      await db('topic_default_questions').insert({
        topic_id: newTopicId,
        question_id: defaultQuestion.id,
      });
    } else {
      const [defaultQuestionId] = await db('topic_questions').insert(
        { content, response_type },
        'id'
      );
      await db('topic_default_questions').insert({
        topic_id: newTopicId,
        question_id: defaultQuestionId,
      });
    }
  }
};

const addTopic = async (topicInfo) => {
  const {
    created_by,
    title,
    frequency,
    context_questions,
    default_questions,
  } = topicInfo;

  const [newTopicId] = await db('topics').insert(
    { created_by, title, frequency },
    'id'
  );

  await addContextsToTopic(context_questions, newTopicId);
  await addDefaultQuestionsToTopic(default_questions, newTopicId);

  return await findById(newTopicId);
};

const createIteration = async (topicId, topicQuestions, contextResponses) => {
  const [iterationId] = await db('topic_iteration').insert(
    {
      topic_id: topicId,
    },
    'id'
  );
  for (const topicQuestion of topicQuestions) {
    const existingQuestion = await db('topic_questions')
      .where({ content: topicQuestion.content })
      .first();
    if (existingQuestion) {
      await db('topic_iteration_and_questions').insert({
        iteration_id: iterationId,
        question_id: existingQuestion.id,
      });
    } else {
      const [topicQuestionId] = await db('topic_questions').insert(
        {
          content: topicQuestion.content,
          answer_type: topicQuestion.answer_type,
        },
        'id'
      );
      await db('topic_iteration_and_questions').insert({
        iteration_id: iterationId,
        question_id: topicQuestionId,
      });
    }
    for (const { id, content } of contextResponses) {
      await db('topic_iteration_and_context_responses').insert({
        iteration_id: iterationId,
        context_id: id,
        content,
      });
    }
  }
};

module.exports = {
  findAllTopics,
  findById,
  addTopic,
  addContextsToTopic,
  addDefaultQuestionsToTopic,
  createIteration,
  getTopicContexts,
  getTopicDefaultQuestions,
  getTopicIterations,
  getTopicMembers,
};
