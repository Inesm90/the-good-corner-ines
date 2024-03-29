import { Arg, Mutation, Query, Resolver, ID, Ctx, Authorized } from "type-graphql";
import { User, UserCreateInput } from "../entities/User";
import { validate } from "class-validator";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../auth";

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
  const users = await User.find({});
  return users;
}

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    });
    return user;
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() context: ContextType): Promise<User> {
    return context.user as User;
  }

  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    const existingUser = await User.findOneBy({ email: data.email});
      if (existingUser) {
        throw new Error(`Error: User already exist}`);
      }
    const newUser = new User();
    Object.assign(newUser, {
      email: (data.email),
      hashedPassword: await argon2.hash(data.password)
    });

    await newUser.save();
    return newUser;
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Mutation(() => User, { nullable: true})
  async signin(
    @Ctx() context: ContextType,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User | null> {

    const existingUser = await User.findOneBy({ email });
      if (existingUser) {
        if (await argon2.verify(existingUser.hashedPassword, password)) {
          const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
            userId: existingUser.id
          },
          process.env.JWT_SECRET || 'secret'
          );

          console.log(token)

          const cookies = new Cookies(context.req, context.res);
          cookies.set("token", token, {
            httpOnly: true,
            secure: false, //prod : true
            maxAge: 1000 * 60 * 60 * 24,
          });          

          return existingUser;
        } else {
          return null
        }
      } else {
        return null
      }
    }
}
