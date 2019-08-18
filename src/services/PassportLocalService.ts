import {Service} from "ts-express-decorators";
import Passport from 'passport';
import {Strategy} from "passport-local";

@Service()
export default class PassportLocalService {

    constructor(){

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
    static serialize(user: any, done: any){
        // done(null, user._id);
        done(null, 9);
    }

    /**
     *
     * @param id
     * @param done
     */
    public deserialize(id: any, done: any) {
        // done(null, this.usersService.find(id));
        done(null, {toto: 9});
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