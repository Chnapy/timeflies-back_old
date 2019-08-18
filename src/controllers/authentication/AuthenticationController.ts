import {BodyParams, Controller, Next, Post, Request, Required, Response} from "ts-express-decorators";
import Express from 'express';
import Passport from 'passport';
import PassportLocalService from "../../services/PassportLocalService";

@Controller('/authenticate')
export class AuthenticationController {

    constructor(
        private passportLocalService: PassportLocalService
    ) {
        passportLocalService.initLocalLogin();
    }

    @Post('')
    authenticate(
        @Request() req: Express.Request,
        @Response() res: Express.Response,
        @Required() @BodyParams('username') username: string,
        @Required() @BodyParams('password') password: string,
        @Next() next: Express.NextFunction
    ): void {

        Passport.authenticate('login')(req, res, next);

        res.json(req.user);

        next();
    }
}
