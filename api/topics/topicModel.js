const db = require('../../data/db-config');

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
  const context_questions = await getTopicContexts(id);
  const default_questions = await getTopicDefaultQuestions(id);
  const topic_iteration_requests = await getTopicIterations(id);

  return {
    ...topicInfo,
    members,
    context_questions,
    default_questions,
    topic_iteration_requests,
  };
};

const addContextsToTopic = async (context_questions, newTopicId) => {
  // Loops over the context questions and checks if the already exists in the table
  for (const context of context_questions) {
    const contextQuestion = await db('topic_context_questions')
      .where({ content: context })
      .first();

    // If the question exists then it creates relationship between topic and context question
    if (contextQuestion) {
      await db('topic_context_junction').insert({
        topic_id: newTopicId,
        context_id: contextQuestion.id,
      });
    } else {
      // If the question doesn't exist, insert it in context question table and
      // create relationship between topic and context question
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
  // Loops over the topic questions and checks if the already exists in the table
  for (const { content, response_type } of default_questions) {
    const defaultQuestion = await db('topic_questions')
      .where({ content, response_type })
      .first();

    // If the question exists then it creates relationship between topic and topic question
    if (defaultQuestion) {
      await db('topic_default_questions').insert({
        topic_id: newTopicId,
        question_id: defaultQuestion.id,
      });
    } else {
      // If the question doesn't exist, insert it in topic question table and
      // create relationship between topic and topic question
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

module.exports = {
  findAllTopics,
  findById,
  addTopic,
  addContextsToTopic,
  addDefaultQuestionsToTopic,
  getTopicContexts,
  getTopicDefaultQuestions,
  getTopicIterations,
  getTopicMembers,
};
