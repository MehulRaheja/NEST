import { 
  createParamDecorator,
  ExecutionContext
} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  // data has a type never which means data will never be used and if a value is provided
  // wherever this decorator is used then it will show an error.
  (data: never, context: ExecutionContext) => {
    // request is an object of incoming request
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
);

// context: instead of giving it a type of Request, ExecutionContext type is assigned because
// it can accept other types of request as well like socket, grpc, graphql, etc and not just http.
