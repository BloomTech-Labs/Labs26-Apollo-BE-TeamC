exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_questions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_questions').insert([
        {
          question: 'What did you accomplish yesterday?',
        },
        {
          question: 'What are you working on today?',
        },
        {
          question: 'Are there any monsters in your path?',
        },
      ]);
    });
};
