exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_iteration')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_iteration').insert([
        {
          topic_id: 1,
        },
      ]);
    });
};
