exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_iteration_and_questions')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('topic_iteration_and_questions').insert([
        {
          iteration_id: 1,
          question_id: 1,
        },
        {
          iteration_id: 1,
          question_id: 2,
        },
        {
          iteration_id: 1,
          question_id: 3,
        },
      ]);
    });
};
