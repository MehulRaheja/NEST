import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Patch,
  Delete, 
  Param, 
  Query,
  NotFoundException,
  Session,
  UseGuards // it says run some guard before executing a request either to entire controller or particular handler
  // UseInterceptors,
  // ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from "../guards/auth.guard";
import { Serialize } from "../interceptors/serialize.interceptor";

@Controller('auth')
@Serialize(UserDto)  // to use Serialize decorator for every request and work as a default serialization handler
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any){
    session.color = color;
  }

  @Get('/color')
  getColor(@Session() session: any){
    return session.color;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any){
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard) // guard applied to a particular handler
  // variable which comes immediately after any decorator is the value returned by the decorator
  whoAmI(@CurrentUser() user: User){
    return user;
  }


  @Post('/signout')
  signOut(@Session() session: any){
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto)) // adding dto to user dtos inside Interceptor dynamically
  @Get('/:id')
  // if we use a different serialize decorator here then it will override the default decorator
  async findUser(@Param('id') id: string) {
    // console.log("run at 2: Handler is running.");
    const user = await this.usersService.findOne(parseInt(id));
    if(!user) {
      throw new NotFoundException('user not found');
    }
    return user; 
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
