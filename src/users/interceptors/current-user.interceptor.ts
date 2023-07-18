import { 
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
 } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable() // to inject the usersService
export class CurrentUserInterceptor implements NestInterceptor {
  constructor (private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user; // assigning user to the http request
    }
    return handler.handle(); // it means go ahead and run the actual query, just like next() method in express.
  }
}