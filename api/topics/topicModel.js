/* eslint-disable prettier/prettier */
const db = require('../../data/db-config');

const findAllTopics = async () => {
  return await db('topics');
};

module.exports = {
  findAllTopics,
};
