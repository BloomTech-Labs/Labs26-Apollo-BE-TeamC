const db = require('../../data/db-config');
// const Topics = require('../topics/topicModel');

const getRequestDetailed = async (iterationId) => {
  const requestInfo = await db('topic_iteration')
    .where({
      id: iterationId,
    })
    .first();
  const context_responses = await db('topic_iteration_and_context_responses')
    .where({ iteration_id: iterationId })
    .join(
      'topic_context_questions',
      'topic_context_questions.id',
      'topic_iteration_and_context_responses.context_id'
    )
    .select(
      'topic_context_questions.content as context_question',
      'topic_iteration_and_context_responses.content as context_response'
    );
  const topic_questions = await db('topic_iteration_and_questions')
    .where({
      iteration_id: iterationId,
    })
    .join(
      'topic_questions',
      'topic_questions.id',
      'topic_iteration_and_questions.question_id'
    )
    .select(
      'topic_questions.id',
      'topic_questions.content',
      'topic_questions.response_type'
    );
  return { ...requestInfo, context_responses, topic_questions };
};

const getRequestQuestions = async (requestId) => {
  return await db('topic_iteration_and_questions')
    .where({ iteration_id: requestId })
    .join(
      'topic_questions',
      'topic_questions.id',
      'topic_iteration_and_questions.question_id'
    )
    .select('topic_questions.id', 'topic_questions.content');
};

const getRequestReplies = async (requestId) => {
  const replies = await db('topic_question_replies')
    .where({
      iteration_id: requestId,
    })
    .join('profiles', 'profiles.id', 'topic_question_replies.profile_id')
    .select('topic_question_replies.*', 'profiles.name', 'profiles.avatarUrl');
  return replies;
};

const addRequestReplies = async (requestId, profileId, replies) => {
  const processedReplies = replies.map((reply) => {
    return { iteration_id: requestId, profile_id: profileId, ...reply };
  });

  await db('topic_question_replies').insert(processedReplies);

  return getRequestReplies(requestId);
};

const getWhoHasReplied = async (iterationId) => {
  const profileIds = await db('topic_question_replies')
    .where({ iteration_id: iterationId })
    .select('topic_question_replies.profile_id');

  const uniqueProfileIds = [...new Set(profileIds.map((p) => p.profile_id))];

  return uniqueProfileIds;
};

const getTopicMembers = async (topicId) => {
  return await db('topic_members_junction')
    .where({ topic_id: topicId })
    .join('profiles', 'profiles.id', 'topic_members_junction.member_id')
    .select('profiles.id', 'profiles.name', 'profiles.avatarUrl');
};

const getMemberRepliedStatus = async (iterationId, topicId) => {
  const hasReplied = await getWhoHasReplied(iterationId);
  const allMembers = await getTopicMembers(topicId);

  const membersWithStatus = allMembers.map((member) => {
    return {
      id: member.id,
      name: member.name,
      has_replied: hasReplied.includes(member.id),
    };
  });

  return membersWithStatus;
};

module.exports = {
  getRequestDetailed,
  getRequestQuestions,
  getRequestReplies,
  getWhoHasReplied,
  getMemberRepliedStatus,
  addRequestReplies,
};
