var dbConfig = {
  synchronize: false,
  migrations: [__dirname + "migrations/*.js"],
  cli: {
    migrationsDir: "migrations",
  },
};

switch(process.env.NODE_ENV) {
  case "development":
    Object.assign(dbConfig, {
      type: "sqlite",
      database: "./db.sqlite",
      entities: [__dirname + "**/*.entity.js"]
    });
    break;
  case "test":
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,  // to run e2e tests with migrations
    });
    break;
  case 'production':
    // db config setup for heroku
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL, // url will be provided by heroku, it contains username and password
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false
      },
    })
    break;
  default:
    throw new Error('Unknown environment');
}

module.exports = dbConfig;