const { Pool } = require('pg');

require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const clusterName = process.env.CLUSTER_NAME;

const db = new Pool({
  connectionString:
    process.env.NODE_ENV === 'test'
      ? `postgresql://${dbUser}:${dbPassword}@${clusterName}:6543/postgres`
      : `postgresql://${dbUser}:${dbPassword}@${clusterName}:6543/postgres`,
});

module.exports = db;
