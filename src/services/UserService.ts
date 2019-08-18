import {Connection} from "typeorm";
import {TypeORMService} from "@tsed/typeorm";
import {User} from "../entity/User";
import {AfterRoutesInit, Service} from "ts-express-decorators";

@Service()
export class UserService implements AfterRoutesInit {
    private connection!: Connection;

    // FIXME service is not injected !
    constructor(private typeORMService: TypeORMService) {
    }

    $afterRoutesInit() {
        this.connection = this.typeORMService.get()!;
        console.log("US this.connection =>", this.connection);
    }

    async create(user: User): Promise<User> {
        await this.connection.manager.save(user);
        console.log("Saved a new user with id: " + user.user_id);

        return user;
    }

    async find(user_id: User['user_id']): Promise<User> {
        const user = await this.connection.manager.findOneOrFail(User, user_id);
        console.log("Loaded user: ", user);

        return user;
    }

    async getAll(): Promise<User[]> {
        const users = await this.connection.manager.find(User);
        console.log("Loaded users: ", users);

        return users;
    }
}