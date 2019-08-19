import {Connection} from "typeorm";
import {TypeORMService} from "@tsed/typeorm";
import {User} from "../entity/User";
import {Service} from "@tsed/di";
import {AfterRoutesInit} from "@tsed/common";
import {ORMCONFIG_NAME} from "../Server";

@Service()
export class UserService implements AfterRoutesInit {
    private connection!: Connection;

    constructor(private typeORMService: TypeORMService) {
    }

    $afterRoutesInit() {
        this.connection = this.typeORMService.get(ORMCONFIG_NAME)!;
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