import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    readonly user_id!: string;

    @Column()
    username!: string;

}