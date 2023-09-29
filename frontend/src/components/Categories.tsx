export type CategoryType = {
  id: number;
  name: string;
};

export type CategoryProps = CategoryType;

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <a className="category-navigation-link">
      {props.name}
    </a>
  );
}