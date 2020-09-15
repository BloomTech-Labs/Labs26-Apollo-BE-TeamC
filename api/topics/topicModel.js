/* eslint-disable prettier/prettier */
const db = require('../../data/db-config');

//gets
const findAllTopics = async () => {
  return await db('topics');
};

const findById = async (id) => {
  const topicInfo = await db('topics').where({ id }).first();
  const members = await db('topic_members_junction')
    .where({ topic_id: id })
    .join('profiles', 'profiles.id', 'topic_members_junction.member_id')
    .select('profiles.id', 'profiles.name');
  const contexts = await db('topic_context_junction')
    .where({ topic_id: id })
    .join(
      'topic_context_questions',
      'topic_context_junction.context_id',
      'topic_context_questions.id'
    )
    .select('topic_context_questions.id', 'topic_context_questions.content');
  const defaultQuestions = await db('topic_default_questions')
    .where({ topic_id: id })
    .join(
      'topic_questions',
      'topic_questions.id',
      'topic_default_questions.question_id'
    )
    .select('topic_questions.id', 'topic_questions.content');
  const iterations = await db('topic_iteration')
    .where({ topic_id: id })
    .select('topic_iteration.id', 'topic_iteration.posted_at');
  return { ...topicInfo, members, contexts, defaultQuestions, iterations };
};

//posts
const addTopic = async (info) => {
  const [newTopicId] = await db('topics').insert(info, 'id');
  return await findById(newTopicId);
};

const addContext = async (context, topicId) => {
  const [newTopicContextId] = await db('topic_context_questions').insert(
    context,
    'id'
  );
  await db('topics_context_junction').insert({
    topic_id: topicId,
    context_id: newTopicContextId,
  });
  return await db('topics_context_junction')
    .where({ topic_id: topicId })
    .join(
      'topic_context_questions',
      'topic_context_questions.id',
      'topics_context_junction.context_id'
    )
    .select('topic_context_questions.content');
};

module.exports = {
  findAllTopics,
  findById,
  addTopic,
  addContext,
};
