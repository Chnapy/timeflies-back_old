import Express from 'express';
import Passport from 'passport';
import {BodyParams, Controller, Post, Required, UseAfter} from "@tsed/common";
import {User} from "../../entity/User";
import {BadRequest} from "ts-httpexceptions";

@Controller('/auth')
export class AuthenticationController {

    private static onAuthenticate = (event: string) => (request: Express.Request, response: Express.Response, next: Express.NextFunction): void => {
        Passport.authenticate(event, (err, user: User) => {
            if (err) return next(err);
            if (!user) {
                return next(new BadRequest("Wrong email or password"));
            }

            request.logIn(user, (err) => {
                if (err) return next(err);
                response.json(user);
            });

        })(request, response, next);
    };

    @Post('/')
    @UseAfter(AuthenticationController.onAuthenticate('login'))
    async authenticate(
        @Required() @BodyParams('username') username: string,
        @Required() @BodyParams('password') password: string,
    ) {
        // check params
    }
}
