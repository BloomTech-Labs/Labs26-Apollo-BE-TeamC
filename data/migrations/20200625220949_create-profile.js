exports.up = (knex) => {
  return (
    knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('profiles', (table) => {
        table.string('id').notNullable().unique().primary();
        table.string('email');
        table.string('name');
        table.string('avatarUrl');
        table.timestamps(true, true);
      })

      // Topics
      .createTable('topics', (table) => {
        table.increments();
        table
          .string('created_by')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('profiles')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.string('frequency').notNullable();
        table.string('title').notNullable();
      })

      // Topic Context Questions
      .createTable('topic_context_questions', (table) => {
        table.increments();
        table.string('content').notNullable();
      })

      // Junctions
      // Topics & Contexts Junction
      .createTable('topic_context_junction', (table) => {
        table
          .integer('topic_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topics')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .integer('context_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topic_context_questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.primary(['topic_id', 'context_id']);
      })

      // Topics & Members Junctions
      .createTable('topic_members_junction', (table) => {
        table
          .integer('topic_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topics')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .string('member_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('profiles')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.primary(['topic_id', 'member_id']);
      })

      // Topic Iteration
      .createTable('topic_iteration', (table) => {
        table.increments();
        table
          .integer('topic_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topics')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.timestamp('posted_at').defaultTo(knex.fn.now());
      })

      // Topic Iteration & Context Responses
      .createTable('topic_iteration_and_context_responses', (table) => {
        table
          .integer('iteration_id')
          .unsigned()
          .references('id')
          .inTable('topic_iteration')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .integer('context_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topic_context_questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.string('content').notNullable();
        table.primary(['iteration_id', 'context_id']);
      })

      // Topic Questions
      .createTable('topic_questions', (table) => {
        table.increments();
        table.string('content').notNullable();
        table.string('response_type').notNullable();
      })

      // Topic Default Questions
      .createTable('topic_default_questions', (table) => {
        table
          .integer('topic_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topics')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .integer('question_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('topic_questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.primary(['topic_id', 'question_id']);
      })

      // Topic Iteration and Questions
      .createTable('topic_iteration_and_questions', (table) => {
        table
          .integer('iteration_id')
          .unsigned()
          .references('id')
          .inTable('topic_iteration')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .integer('question_id')
          .unsigned()
          .references('id')
          .inTable('topic_questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.primary(['iteration_id', 'question_id']);
      })

      // Topic Question Replies
      .createTable('topic_question_replies', (table) => {
        table.increments();
        table.timestamp('posted_at').defaultTo(knex.fn.now());
        table
          .integer('iteration_id')
          .unsigned()
          .references('id')
          .inTable('topic_iteration')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .integer('question_id')
          .unsigned()
          .references('id')
          .inTable('topic_questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .string('profile_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('profiles')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.string('content').notNullable();
      })

      // Topic Reply Thread
      .createTable('topic_reply_thread', (table) => {
        table.timestamp('posted_at').defaultTo(knex.fn.now());
        table
          .integer('reply_id')
          .unsigned()
          .references('id')
          .inTable('topic_question_replies')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table
          .string('profile_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('profiles')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.string('content').notNullable();
        table.primary(['reply_id', 'profile_id']);
      })
  );
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('topic_reply_thread')
    .dropTableIfExists('topic_question_replies')
    .dropTableIfExists('topic_iteration_and_questions')
    .dropTableIfExists('topic_default_questions')
    .dropTableIfExists('topic_questions')
    .dropTableIfExists('topic_iteration_and_context_responses')
    .dropTableIfExists('topic_iteration')
    .dropTableIfExists('topic_members_junction')
    .dropTableIfExists('topic_context_junction')
    .dropTableIfExists('topic_context_questions')
    .dropTableIfExists('topics')
    .dropTableIfExists('profiles');
};
