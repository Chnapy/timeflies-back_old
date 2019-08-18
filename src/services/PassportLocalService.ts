import Passport from 'passport';
import {Strategy} from "passport-local";
import {User} from "../entity/User";
import {UserService} from "./UserService";
import { Service } from 'ts-express-decorators';

@Service()
export class PassportLocalService {

    constructor(
        private usersService: UserService
    ){

        // used to serialize the user for the session
        Passport.serializeUser(PassportLocalService.serialize);

        // used to deserialize the user
        Passport.deserializeUser(this.deserialize.bind(this));
    }

    middlewareInitialize() {
        return Passport.initialize();
    }

    middlewareSession() {
        return Passport.session();
    }

    /**
     *
     * @param user
     * @param done
     */
    static serialize(user: User, done: any){
        done(null, user.user_id);
    }

    /**
     *
     * @param id
     * @param done
     */
    public deserialize(user_id: User['user_id'], done: any) {
        done(null, this.usersService.find(user_id));
    };

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    public initLocalLogin(){

        Passport.use('login', new Strategy({
            // by default, local strategy uses username and password
            usernameField:     'username',
            passwordField:     'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, this.onLocalLogin));

    }

    private onLocalLogin = (req: Express.Request, username: string, password: string, done: any) => {
        //$log.debug('LocalLogin', login, password);

        // const user = this.usersService.findByCredential(username, password);
        const user = {toto: 9};

        if (!user) {
            return done(null, false); // req.flash is the way to set flashdata using connect-flash
        }


        // all is well, return successful user
        return done(null, user);

    };
}