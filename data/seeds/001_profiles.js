const faker = require('faker');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('profiles')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert([
        {
          id: '00ulthapbErVUwVJy4x6',
          email: 'llama001@maildrop.cc',
          name: 'Test001 User',
          avatarUrl: faker.image.avatar(),
        },
        {
          id: '00ultwew80Onb2vOT4x6',
          email: 'llama002@maildrop.cc',
          name: 'Test002 User',
          avatarUrl: faker.image.avatar(),
        },
        {
          id: '00ultx74kMUmEW8054x6',
          email: 'llama003@maildrop.cc',
          name: 'Test003 User',
          avatarUrl: faker.image.avatar(),
        },
        {
          id: '00ultwqjtqt4VCcS24x6',
          email: 'llama004@maildrop.cc',
          name: 'Test004 User',
          avatarUrl: faker.image.avatar(),
        },
      ]);
    });
};
