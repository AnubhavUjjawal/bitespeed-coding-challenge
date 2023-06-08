import {knex} from 'knex';
import config from './config';
import {knexSnakeCaseMappers} from 'objection';

const db = knex({
  client: 'pg',
  connection: config.DB_URL,
  ...knexSnakeCaseMappers(),
});

export default db;
