import { User } from '../users/users.entity';
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false})
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // we need to sepup one to many relationship for the user and many to one relationship for the reports
  // setting up relation of many to one relationship
  // by adding many to one relation typeorm has made a change in our database
  // and created a new column "user" in reports table and same doesn't happen with one to many relation
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}