exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topics')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topics').insert([
        {
          created_by: '00ulthapbErVUwVJy4x6',
          frequency: 'Daily',
          title: 'Development Team',
        },
      ]);
    });
};
