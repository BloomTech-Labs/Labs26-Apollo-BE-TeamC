exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('topic_context_questions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('topic_context_questions').insert([
        {
          content: 'What is the current priority?',
        },
        {
          content:
            'Do you have any key learnings to share with the team from stakeholders or customers?',
        },
        {
          content: 'What upcoming demos or events should the team be aware of?',
        },
      ]);
    });
};
