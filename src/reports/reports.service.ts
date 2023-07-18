import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable() // makes service injectable into the controller, module etc
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {};

  async createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto) {
    return this.repo.createQueryBuilder()

      // this will return the field "price", whose value is average of the values of the price field of filtered docs
      // so AVG will return only a single row
      .select('AVG(price)', 'price')

      // where statement is the filter which is checking the "make" column 
      // value it is taking from :make and :make is taking value from make inside {make: make }
      .where('make = :make', { make: make })

      // if we use where again it will overwrite the previous where statement
      // so instead andWhere statement is used so that both the filter will be applied
      .andWhere('model = :model', { model })

      // here we are checking that lng value should be between lng(value inside table) - lng(incoming filter value) = (-5 and +5) 
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })

      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })

      .andWhere('year - :year BETWEEN -3 AND 3', { year })

      // it is checking that approved column of the table should be true
      .andWhere('approved IS TRUE')

      // orderBy is used for sorting based on some logic 
      // we are sorting in descending order and take the absolute value of mileage(value inside table) - mileage(incoming filter value)
      // orderBy doesn't take parameter object as a second argument
      // so we use setParameters statement to provide parameter object separately
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({mileage})

      // limiting the result to 3 docs
      .limit(3)

      // // getRawMany is used when we expect many different records
      // .getRawMany()

      // getRawOne is used when we expect only one record
      .getRawOne()
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: {id: parseInt(id)}});
    if(!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
