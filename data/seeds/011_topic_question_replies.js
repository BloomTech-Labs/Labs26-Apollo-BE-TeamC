exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_question_replies')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_question_replies').insert([
        {
          iteration_id: 1,
          question_id: 1,
          profile_id: '00ulthapbErVUwVJy4x6',
          content: 'Ate a sandwich',
        },
        {
          iteration_id: 1,
          question_id: 2,
          profile_id: '00ulthapbErVUwVJy4x6',
          content: 'Making a sandwich',
        },
        {
          iteration_id: 1,
          question_id: 3,
          profile_id: '00ulthapbErVUwVJy4x6',
          content: 'Sandwich monsters',
        },
      ]);
    });
};
