import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the user service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
      // here we are telling typeScript to treat returned object as a user entity
    };


    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { // Below 2 lines means,  if anyone asks for UserService give them fakeUsersService
          provide: UsersService,
          useValue: fakeUsersService
        }
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('asdff@gmail.com', 'edfwer3234');

    expect(user.password !== 'edfwer3234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    // when user is returned in above function and here we throw an error of email already in use, 
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(  BadRequestException, );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect( service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: 'laskdjf' } as User]);
    
    await expect( service.signin('laskdjf@alskdfj.com', 'passowrd') ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    // hashed password provided below should be valid for the password passed in the argument (i.e. 'laskdjf')
    // fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: '0a97a33c1647536a.3df49507b76e5fd31d6100274cd51ad7ecdc8fea25f0670ed8a2355d4cfd7173' } as User]);
    await service.signup('laskdjf@alskdfj.com', 'laskdjf');
    
    const user = await expect( service.signin('laskdjf@alskdfj.com', 'laskdjf') );
    expect(user).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // for this test we are signing up twice in a row
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
 
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
 
  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });
});

