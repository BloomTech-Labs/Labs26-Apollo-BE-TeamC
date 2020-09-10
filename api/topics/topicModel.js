/* eslint-disable prettier/prettier */
const db = require('../../data/db-config');

//gets
const findAllTopics = async () => {
  return await db('topics');
};

const findById = async (id) => {
  return await db('topics').where({ id: id });
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
