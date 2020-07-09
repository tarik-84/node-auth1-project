
exports.seed = async function(knex) {
  await knex('users').insert([
    {username: 'john doe', password: 'abc123'},
    {username: 'jane doe', password: 'def456'},
    {username: 'josh doe', password: 'ghi789'},
  ])
};
