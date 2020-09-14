exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_context_junction')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('topic_context_junction').insert([
        {
          topic_id: 1,
          context_id: 1,
        },
        {
          topic_id: 1,
          context_id: 2,
        },
        {
          topic_id: 1,
          context_id: 3,
        },
      ]);
    });
};
