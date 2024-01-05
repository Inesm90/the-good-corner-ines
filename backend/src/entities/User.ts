import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
  } from "typeorm";
  import { IsEmail, Matches } from "class-validator";
  import { Field, ID, InputType, ObjectType } from "type-graphql";
  import { Ad } from "./Ad";
  
  @Entity()
  @ObjectType()
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;
  
    @Column({length: 255, unique: true})
    @Field()
    email!: string;
  
    @Column()
    @Field()
    hashedPassword!: string;

    @OneToMany(() => Ad, (ad) => ad.createdBy)
    @Field(() => [Ad])
    ads!: Ad[];
  }
  
  @InputType()
  export class UserCreateInput {
    @Field()
    @IsEmail()
    email!: string;
  
    @Field()
    @Matches(/^.{8,50}$/)
    password!: string;
  }