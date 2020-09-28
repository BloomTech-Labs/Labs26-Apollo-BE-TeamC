exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_members_junction')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('topic_members_junction').insert([
        {
          topic_id: 1,
          member_id: '00ulthapbErVUwVJy4x6',
        },
        {
          topic_id: 1,
          member_id: '00ultwew80Onb2vOT4x6',
        },
      ]);
    });
};
