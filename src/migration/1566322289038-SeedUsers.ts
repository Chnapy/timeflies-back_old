import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";
import {UserSeed} from "../seed/user.seed";

export class SeedUsers1566322289038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await getRepository(User, 'dev').save(UserSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        const repo = await getRepository(User, 'dev');

        const users = await repo.find({
            where: UserSeed.map(us => ({username: us.username}))
        });

        await repo.remove(users);
    }

}
