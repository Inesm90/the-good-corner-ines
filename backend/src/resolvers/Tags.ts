import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Tag } from "../entities/Tag";
import { validate } from "class-validator";

@Resolver(Tag)
export class TagsResolver {
  @Query(() => [Tag])
  async allTags(): Promise<Tag[]> {
    const tags = await Tag.find({
      relations: { ads: true },
    });
    console.log(tags);
    return tags;
  }
}