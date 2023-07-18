import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users.service";
import { User } from "../users.entity";

// Request interface doens't have currentUser property so we need to patch the property with it.
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable() // to use dependency injection
export class CurrentUserMiddleware implements NestMiddleware {
  constructor (
    private usersService: UsersService
  ){}

  // for valid middleware we need to define use() function
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if(userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}

// to ignore the eslint error on the next line
// @ts-ignore