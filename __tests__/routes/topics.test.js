const request = require('supertest');
const express = require('express');
const Profiles = require('../../api/profile/profileModel');
const topicDb = require('../../api/topics/topicModel');
const topicRouter = require('../../api/topics/topicRouter');
const server = express();
server.use(express.json());

jest.mock('../../api/topics/topicModel');
jest.mock('../../api/profile/profileModel');

describe('Topic router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/topics', topicRouter);
    jest.clearAllMocks();
  });

  describe('GET /topics', () => {
    it('should return 200', async () => {
      topicDb.findAllTopics.mockResolvedValue();
      const res = await request(server).get('/topics');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(topicDb.findAllTopics.mock.calls.length).toBe(1);
    });
  });

  describe('GET /topics/:id', () => {
    it('should return 200 when topic is found', async () => {
      topicDb.findById.mockResolvedValue({
        id: 2,
        created_by: '00ulthapbErVUwVJy4x6',
        frequency: 'daily',
        title: 'Testing Title',
      });
      const res = await request(server).get('/topics/2');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Testing Title');
      expect(topicDb.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no topic found', async () => {
      topicDb.findById.mockResolvedValue({
        message: 'there are no topics here.',
      });
      const res = await request(server).get('/topics/9999');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('there are no topics here.');
    });
  });

  describe('POST /topics', () => {
    it('should return 201 when a topic is created', async () => {
      const topic = {
        created_by: '00ulthapbErVUwVJy4x6',
        frequency: 'Monthly',
        title: 'Test005',
        context_questions: [
          'Did Erik get endorsed?',
          'Did Erik Submit All Of His Artifacts?',
          'Why do we live on a rock?',
        ],
        default_questions: [
          {
            content: 'What did you accomplish yesterday?',
            response_type: 'String',
          },
          {
            content: 'What are you working on today?',
            response_type: 'String',
          },
          {
            content: 'Are there any monsters in your path?',
            response_type: 'String',
          },
        ],
      };
      Profiles.findById.mockResolvedValue({});
      topicDb.addTopic.mockResolvedValue([
        Object.assign({ id: '77777777' }, topic),
      ]);
      const res = await request(server).post('/topics').send(topic);

      expect(res.status).toBe(201);
      expect(topicDb.addTopic.mock.calls.length).toBe(1);
    });
  });
});
