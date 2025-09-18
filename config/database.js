module.exports = {
  development: {
    connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/aps_nashik_db',
    ssl: false
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
}
