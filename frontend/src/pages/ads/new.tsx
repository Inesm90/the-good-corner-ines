import { CategoryType } from "@/components/Categories";
import axios from "axios";
import { FormEvent, useState, useEffect } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/router";

type AdFormData = {
    title: string;
    description: string;
    imgUrl: string;
    price: number;
    category: { id: number } | null;
}

const NewAd = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [error, setError] = useState<"title" | "price">();
    const [hasBeenSent, setHasBeenSent] = useState(false);

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imgUrl, setImgUrl] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<null | number>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchCategories =async () => {
            const result = await axios.get<CategoryType[]>(`${API_URL}/categories`);
            setCategories(result.data)
        };
        fetchCategories();
    
    }, []);

    async function postData(data:AdFormData) {
        try {
            const result = await axios.post(`${API_URL}/ads`, data)
            if (result.status === 200) {
                router.push("/");
            }

    console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    function onSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(undefined);

        const data: AdFormData = {
            title,
            description,
            imgUrl,
            price,
            category: categoryId ? { id: Number(categoryId) } : null,
          };
        console.log(data)
            
          if (data.title.trim().length < 3) {
            setError("title");
          } else if (data.price < 0) {
            setError("price");
          } else {
            postData(data)
            } 
        }
        //postData(data)
    
    return (
        <form onSubmit={(e) => onSubmit(e)}
            >
        <label>
            Titre de l'&apos;annonce: <br />
            <input onChange={(e) => setTitle(e.target.value)} type="text" className="text-field" name="titre"/> <br />
        </label>
        <label>            <label>
            Description <br />
            <input onChange={(e) => setDescription(e.target.value)} type="text" className="text-field" name="description"/> <br />
        </label>
        <label>
            Image <br />
            <input onChange={(e) => setImgUrl(e.target.value)} type="text" className="text-field" name="imgUrl"/> <br />
        </label>
            Prix:  <br />
            <input onChange={(e) => setPrice(+e.target.value)}type="number" className="text-field" name="price" placeholder="0,00€" /> <br />
            </label>
            Categorie  <br />
          <select onChange={(e) => setCategoryId(+e.target.value)} name="categoryId">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        <button type="submit" className="button">Poster</button>
        </form>
    )
};

export default NewAd;