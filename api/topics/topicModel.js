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



module.exports = {
  findAllTopics,
  findById,
  addTopic,
};
