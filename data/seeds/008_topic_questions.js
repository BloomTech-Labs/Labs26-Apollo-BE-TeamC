exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_questions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_questions').insert([
        {
          content: 'What did you accomplish yesterday?',
          response_type: 'String',
        },
        {
          content: 'What are you working on today?',
          response_type: 'String',
        },
        {
          content: 'Are there any monsters in your path?',
          response_type: 'String',
        },
      ]);
    });
};
