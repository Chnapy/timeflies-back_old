import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Character {

    @PrimaryGeneratedColumn('uuid')
    readonly character_id!: string;

    @Column()
    name!: string;
}