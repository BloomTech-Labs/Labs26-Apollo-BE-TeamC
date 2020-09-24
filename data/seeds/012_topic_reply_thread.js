exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_reply_thread')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_reply_thread').insert([
        {
          reply_id: 1,
          profile_id: '00ulthapbErVUwVJy4x6',
          content: 'Sounds about right',
        },
      ]);
    });
};
