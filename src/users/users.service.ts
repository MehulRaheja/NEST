import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "./users.entity"; 

@Injectable()
export class UsersService {
  constructor( @InjectRepository(User) private repo: Repository<User> ){}

  create(email: string, password: string) {
    const user = this.repo.create({email, password});

    return this.repo.save(user);
  }

  async findOne(id: number) {
    if(!id) return null;
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  // attrs partially contains the fields of User entity 
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException("User not found");
    }
    Object.assign(user, attrs); // this will overwrite fields of user with the fields inside the attrs
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException("User not found");
    }
    return this.repo.remove(user);
  }
}

// Hookes inside the entity(e.g. AfterInsert, AfterUpdate, AfterRemove) will not get executed if we pass the 
// plain object (e.g. {email, password}) instead of instance (like we do with create() method) to the save() method




// Locate the findOne method and update the return to look like this:

// findOne(id: number) {
//   return this.repo.findOneBy({ id });
// }


// Locate the find method and update the return to look like this:

// find(email: string) {
//   return this.repo.find({ where: { email } });
// }

