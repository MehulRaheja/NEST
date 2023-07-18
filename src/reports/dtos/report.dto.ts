import { Expose, Transform } from "class-transformer";
import { User } from "src/users/users.entity";

// New fields can also be added here to send it to the user
export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  // obj is reference to original report entity
  @Transform(({obj}) => obj.user.id)
  @Expose()
  userId: number;
}