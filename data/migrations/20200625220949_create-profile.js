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

      //topics
      .createTable('topics', (table) => {
        table.increments();
        table
          .integer('created_by')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('profiles')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.string('frequency').notNullable();
        table.string('title').notNullable();
      })

      //topic context questions
      .createTable('topic_context_questions', (table) => {
        table.increments();
        table.string('content').notNullable();
      })

      // Junctions
      //Topics & Contexts junction
      .createTable('topics_context_junction', (table) => {
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

      //Topics & Members Junctions
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
          .integer('member_id')
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

      //questions for the topic
      .createTable('topic_questions', (table) => {
        table.increments();
        table.string('question').notNullable();
      })

      //Topic Iteration and Questions
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
          .inTable('questions')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');
        table.integer('answer_type').unsigned().notNullable();
        table.primary(['iteration_id', 'question_id']);
      })
  );
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('profiles');
};
