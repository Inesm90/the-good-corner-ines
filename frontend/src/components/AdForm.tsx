import { AdType } from "@/components/AdCard";
import { CategoryType } from "@/components/Categories";
import { Layout } from "@/components/Layout";
import { mutationCreateAd } from "@/graphql/mutationCreateAd";
import { mutationUpdateAd } from "@/graphql/mutationUpdateAd";
import { queryAd } from "@/graphql/queryAd";
import { queryAllCategories } from "@/graphql/queryAllCategories";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { queryAllAds } from "./RecentAds";

type AdFormData = {
  title: string;
  description: string;
  imgUrl: string;
  price: number;
  category: { id: number } | null;
  tags: any[];
};

type AdFormProps = {
  ad?: AdType;
};

export default function AdForm(props: AdFormProps) {
  const [error, setError] = useState<"title" | "price">();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<null | number>(null);

  const {
    data: categoriesData,
    error: categoriesError,
    loading: categoriesLoading,
  } = useQuery<{ items: CategoryType[] }>(queryAllCategories);
  const categories = categoriesData ? categoriesData.items : [];

  const router = useRouter();

  const [doCreate, { loading: createLoading }] = useMutation(mutationCreateAd, {
    refetchQueries: [queryAllAds],
  });
  const [doUpdate, { loading: updateLoading }] = useMutation(mutationUpdateAd, {
    refetchQueries: [queryAd, queryAllAds],
  });
  const loading = createLoading || updateLoading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const data: AdFormData = {
      title,
      description,
      imgUrl,
      price,
      category: categoryId ? { id: Number(categoryId) } : null,
      tags: [],
    };

    if (data.title.trim().length < 3) {
      setError("title");
    } else if (data.price < 0) {
      setError("price");
    } else {
      if (!props.ad) {
        const result = await doCreate({
          variables: {
            data: data,
          },
        });
        if ("id" in result.data?.item) {
          router.replace(`/ads/${result.data.item.id}`);
        }
      } else {
        const result = await doUpdate({
          variables: {
            id: props.ad?.id,
            data: data,
          },
        });
        if (!result.errors?.length) {
          router.replace(`/ads/${props.ad.id}`);
        }
      }
    }
  }

  useEffect(() => {
    if (props.ad) {
      setTitle(props.ad.title);
      setDescription(props.ad.description);
      setPrice(props.ad.price);
      setImgUrl(props.ad.imgUrl);
      setCategoryId(
        props.ad.category ? props.ad.category.id : categories[0]?.id
      );
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id);
        }
      }, [props.ad, categories]);
  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <div className="signup-container">
          <p>{props.ad ? "Modifier l'offre" : "Nouvelle offre"}</p>
          {error === "price" && (
            <p className="error-message">Le prix doit être positif</p>
          )}
          {error === "title" && (
            <p className="error-message">
              Le titre est requis et doit faire plus de 3 caractères
            </p>
          )}
          <form onSubmit={onSubmit} className="ad-form">
            <label>Titre de l'annonce:</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
            <br />
            <br />
            <label>Description de l'annonce:</label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
            <br />
            <br />
            <label>Lien de l'image:</label>
            <input
              type="text"
              name="imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="form-input"
            />
            <br />
            <br />
            <label>Prix:</label>
            <input
              type="number"
              name="price"
              placeholder="0,00€"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="form-input"
            />
            <br />
            <br />
            <label>Catégorie:</label>
            <select
              name="categoryId"
              value={categoryId + ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="form-input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <br />
            <br />
            <button type="submit" disabled={loading} className="submit-button">
              {props.ad ? "Modifier" : "Créer"}
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
}