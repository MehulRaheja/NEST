import { Transform } from "class-transformer";
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude
} from "class-validator";


// we will transform the incoming query parameters before it gets 
// assigned to the dto object by using Transform() decorator

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  // year is comming as an string in the query parameters 
  // and we convert it into a number before dto validates it
  @Transform(({value}) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2040)
  year: number;

  // mileage is comming as an string in the query parameters 
  // and we convert it into a number before dto validates it
  @Transform(({value}) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  // lng is comming as an string in the query parameters 
  // and we convert it into a number before dto validates it
  @Transform(({value}) => parseFloat(value))
  @IsLongitude()
  lng: number;

  // lat is comming as an string in the query parameters 
  // and we convert it into a number before dto validates it
  @Transform(({value}) => parseFloat(value))
  @IsLatitude()
  lat: number;
}