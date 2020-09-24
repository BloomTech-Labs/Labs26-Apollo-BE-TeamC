const request = require('supertest');
const server = require('../../api/app.js');

describe('topics/ get endpoint', () => {
  it('should return 200', () => {
    return request(server)
      .get('/topics/')
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});

describe('post a topic', () => {
  it('should return a 201 status code/create a topic', () => {
    return request(server)
      .post('/topics/')
      .send({
        created_by: '00ulthapbErVUwVJy4x6',
        frequency: 'Monthly',
        title: 'Test003',
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
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.frequency).toBe('Monthly');
        expect(res.type).toMatch(/json/i);
      });
  });
});

describe('Making an instance of a topic/request', () => {
  it('Should create a Topic Request', () => {
    return request(server)
      .post('/topics/1/request')
      .send({
        topic_questions: [
          {
            content: 'What did you accomplish yesterday?',
            response_type: 'string',
          },
          {
            content: 'Why are you alive man?',
            response_type: 'string',
          },
          {
            content: 'Have you seen my dog?',
            response_type: 'string',
          },
        ],
        context_responses: [
          {
            id: 1,
            content: 'Get something deployed',
          },
          {
            id: 2,
            content: 'Get something returning',
          },
          {
            id: 3,
            content: 'We have a nice dmo coming up! be ready',
          },
        ],
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.topic_id).toBe(1);
        expect(res.type).toMatch(/json/i);
      });
  });
});
