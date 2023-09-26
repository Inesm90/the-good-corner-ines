import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Ad } from "./entities/ad";
import { Tag } from "./entities/Tag";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "./good_corner.sqlite",
  entities: [Category, Ad, Tag],
  synchronize: true,
  logging: true,
});
