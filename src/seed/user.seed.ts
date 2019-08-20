import {User} from "../entity/User";

export const UserSeed: Omit<User, 'user_id'>[] = [
    {
        username: 'user'
    },
    {
        username: 'admin'
    }
];