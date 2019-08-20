import Passport from 'passport';
import {Strategy} from "passport-local";
import {User} from "../entity/User";
import {UserService} from "./UserService";
import {Inject, Service} from "@tsed/di";
import {DoneFn} from '../types/PassportTypes';
import {AfterRoutesInit, BeforeRoutesInit, ServerSettingsService, ExpressApplication} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

    constructor(private usersService: UserService,
                private serverSettings: ServerSettingsService,
                @Inject(ExpressApplication) private  expressApplication: ExpressApplication) {

        // used to serialize the user for the session
        Passport.serializeUser(PassportLocalService.serialize);

        // used to deserialize the user
        Passport.deserializeUser(this.deserialize.bind(this));
    }

    $beforeRoutesInit() {
        const options = this.serverSettings.get("passport") || {} as any;
        const {userProperty, pauseStream} = options;

        this.expressApplication.use(Passport.initialize({userProperty}));
        this.expressApplication.use(Passport.session({pauseStream}));
    }

    $afterRoutesInit() {
        this.initializeLogin();
    }

    static serialize(user: User, done: DoneFn<User['user_id']>) {
        done(null, user.user_id);
    }

    public deserialize(user_id: User['user_id'], done: DoneFn<Promise<User>>) {
        done(null, this.usersService.find(user_id));
    };

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    public initializeLogin() {
        Passport.use("login", new Strategy({
            // by default, local strategy uses username and password
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, email, password, done) => {
            this.login(email, password)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        }));
    }

    private async login(username: string, password: string) {
        //$log.debug('LocalLogin', login, password);

        const user = await this.usersService.findByCredential(username, password);

        if (!user) {
            throw new NotFound('User not found');
        }


        // all is well, return successful user
        return user;
    };
}