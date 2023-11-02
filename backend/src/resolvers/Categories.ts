import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Category, CategoryCreateInput } from "../entities/Category";
import { validate } from "class-validator";

@Resolver(Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async allCategories(): Promise<Category[]> {
    const categories = await Category.find({ relations: { ads: true } });
    return categories;
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data", () => CategoryCreateInput) data: CategoryCreateInput): Promise<Category> {
    const newCategory = new Category();
    Object.assign(newCategory, data);

    const errors = await validate(newCategory);
    if (errors.length === 0) {
      await newCategory.save();
      return newCategory;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }
}