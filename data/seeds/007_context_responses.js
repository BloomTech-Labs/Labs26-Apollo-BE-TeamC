exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_iteration_and_context_responses')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('topic_iteration_and_context_responses').insert([
        {
          iteration_id: 1,
          context_id: 1,
          content: 'Get something deployed',
        },
        {
          iteration_id: 1,
          context_id: 2,
          content: 'Get something returning',
        },
        {
          iteration_id: 1,
          context_id: 3,
          content: 'We have a nice dmo coming up! be ready',
        },
      ]);
    });
};
