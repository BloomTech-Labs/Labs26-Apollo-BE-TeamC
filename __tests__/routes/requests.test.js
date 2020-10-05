const request = require('supertest');
const express = require('express');
const Requests = require('../../api/requests/requestModel');
const requestRouter = require('../../api/requests/requestRouter');
const server = express();
server.use(express.json());

jest.mock('../../api/requests/requestModel');

describe('requests router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/requests', requestRouter);
    jest.clearAllMocks();
  });

  describe('GET /requests/:id', () => {
    it('should return 200', async () => {
      const requestInfo = {
        id: 1,
        topic_id: 1,
        posted_at: '2020-09-29T19:51:44.336Z',
        context_responses: [
          {
            context_question: 'What is the current priority?',
            context_response: 'Get something deployed',
          },
          {
            context_question:
              'Do you have any key learnings to share with the team from stakeholders or customers?',
            context_response: 'Get something returning',
          },
          {
            context_question:
              'What upcoming demos or events should the team be aware of?',
            context_response: 'We have a nice dmo coming up! be ready',
          },
        ],
        topic_questions: [
          {
            id: 1,
            content: 'What did you accomplish yesterday?',
            response_type: 'String',
          },
          {
            id: 2,
            content: 'What are you working on today?',
            response_type: 'String',
          },
          {
            id: 3,
            content: 'Are there any monsters in your path?',
            response_type: 'String',
          },
        ],
      };

      Requests.getRequestDetailed.mockResolvedValue(requestInfo);
      const res = await request(server).get('/requests/1');

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(requestInfo);
      expect(Requests.getRequestDetailed.mock.calls.length).toBe(1);
    });

    it('should return 404', async () => {
      Requests.getRequestDetailed.mockResolvedValue({
        context_responses: [],
        topic_questions: [],
      });
      const res = await request(server).get('/requests/0');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Could not find request with that id');
    });
  });

  describe('POST /requests/:id', () => {
    it('should return 201 when replies are sent', async () => {
      const requestInfo = {
        id: 1,
        topic_id: 1,
        posted_at: '2020-09-29T19:51:44.336Z',
        context_responses: [
          {
            context_question: 'What is the current priority?',
            context_response: 'Get something deployed',
          },
          {
            context_question:
              'Do you have any key learnings to share with the team from stakeholders or customers?',
            context_response: 'Get something returning',
          },
          {
            context_question:
              'What upcoming demos or events should the team be aware of?',
            context_response: 'We have a nice dmo coming up! be ready',
          },
        ],
        topic_questions: [
          {
            id: 1,
            content: 'What did you accomplish yesterday?',
            response_type: 'String',
          },
          {
            id: 2,
            content: 'What are you working on today?',
            response_type: 'String',
          },
          {
            id: 3,
            content: 'Are there any monsters in your path?',
            response_type: 'String',
          },
        ],
      };

      const replyObject = {
        profile_id: '00ultwew80Onb2vOT4x6',
        replies: [
          { question_id: 1, content: 'Second User first Answer' },
          { question_id: 2, content: 'Second User second Answer' },
          { question_id: 3, content: 'Second User third Answer' },
        ],
      };

      Requests.getRequestDetailed.mockResolvedValue(requestInfo);
      Requests.addRequestReplies.mockResolvedValue(replyObject.replies);
      const res = await request(server).post('/requests/1').send(replyObject);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(replyObject.replies);
    });

    it('should return 400 when replies are sent without profile id', async () => {
      const replyObject = {
        replies: [
          { question_id: 1, content: 'Second User first Answer' },
          { question_id: 2, content: 'Second User second Answer' },
          { question_id: 3, content: 'Second User third Answer' },
        ],
      };
      const res = await request(server).post('/requests/1').send(replyObject);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Must include a profile id');
    });

    it('should return 400 when replies are sent without replies', async () => {
      const replyObject = {
        profile_id: '00ultwew80Onb2vOT4x6',
      };
      const res = await request(server).post('/requests/1').send(replyObject);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Must include replies');
    });

    it('should return 400 when replies are sent with incorrect reply format', async () => {
      const replyObject = {
        profile_id: '00ultwew80Onb2vOT4x6',
        replies: [{ question_id: 1 }, { question_id: 2 }, { question_id: 3 }],
      };
      const res = await request(server).post('/requests/1').send(replyObject);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Every reply must include a content value');

      const replyObjectTwo = {
        profile_id: '00ultwew80Onb2vOT4x6',
        replies: [
          { content: 'Second User first Answer' },
          { content: 'Second User second Answer' },
          { content: 'Second User third Answer' },
        ],
      };

      const resTwo = await request(server)
        .post('/requests/1')
        .send(replyObjectTwo);

      expect(resTwo.status).toBe(400);
      expect(resTwo.body.error).toBe('Every reply must include a question id');
    });
  });
});
