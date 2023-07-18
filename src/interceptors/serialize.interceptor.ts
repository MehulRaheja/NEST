import { 
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler, 
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass, plainToInstance } from "class-transformer";

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {  // here ClassConstructor says as long as there is a class coming as dto there is no problem
  return UseInterceptors(new SerializeInterceptor(dto));
}

// implements keyword is used when we want new class to satisfies all the requirements of abstract classs or interface
export class SerializeInterceptor implements NestInterceptor {
  constructor (private dto: any) { }

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
    // Run something before a request is handled by the request handler 
    // console.log("run at 1: I am running before the request handler", context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the data is sent out 
        // console.log("run at 3: I am running before the data is sent out", data);
        return plainToInstance(this.dto, data, { // adding dto dynamically, which is comming from the controller
          excludeExtraneousValues: true // true means only fields with @Expose() decorator inside the Dto is will only be sent out
        });
      })
    )
  }
}

// plainToInstance was changed to plainToInstance