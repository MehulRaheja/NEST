import { CanActivate, ExecutionContext } from "@nestjs/common";
// ExecutionContext is a wrapper around the incoming request

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if(!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}