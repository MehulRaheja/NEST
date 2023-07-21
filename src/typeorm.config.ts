import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';

export default new DataSource({
  type: 'sqlite',
  database: "./db.sqlite",
  entities: [User, Report],
  synchronize: false,
  migrations: ["../migrations/*.js"],
  // cli: {
  //   migrationsDir: "migrations",
  // },
});

