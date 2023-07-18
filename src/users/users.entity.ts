import { Report } from '../reports/reports.entity';
import { 
  AfterInsert, 
  AfterUpdate, 
  AfterRemove, 
  Entity, 
  Column, 
  OneToMany,
  PrimaryGeneratedColumn 
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  // we need to sepup one to many relationship for the user and many to one relationship for the reports
  // setting up relation of one to many relationship
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert() // this decorator performs a function after user inserted to the database
  logInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterUpdate() // this decorator performs a function after user updated into the database
  logUpdate() {
    console.log('Updated user with id', this.id);
  }

  @AfterRemove() // this decorator performs a function after user is removed from the database
  logRemove() {
    console.log('Removed user with id', this.id);
  }
}

