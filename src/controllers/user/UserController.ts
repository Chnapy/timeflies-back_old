import {Controller, Post, BodyParams, Get} from "@tsed/common";
import {UserService} from "../../services/UserService";
import {User} from "../../entity/User";

@Controller("/users")
export class UserController {

    constructor(private userService: UserService) {

    }

    @Post("/")
    create(@BodyParams() user: User): Promise<User> {

        return this.userService.create(user);
    }

    @Get("/")
    getList(): Promise<User[]> {

        return this.userService.getAll();
    }
}