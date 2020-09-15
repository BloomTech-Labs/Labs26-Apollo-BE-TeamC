exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_default_questions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_default_questions').insert([
        {
          topic_id: 1,
          question_id: 1,
        },
        {
          topic_id: 1,
          question_id: 2,
        },
        {
          topic_id: 1,
          question_id: 3,
        },
      ]);
    });
};
