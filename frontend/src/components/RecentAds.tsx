import { useState, useEffect } from "react";
import axios from "axios";
import { AdCard, AdCardProps } from "./AdCard";
import { API_URL } from "@/config";

export function RecentAds(): React.ReactNode {
  const [total, setTotal] = useState(0);
  const [ads, setAds] = useState<AdCardProps[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get<AdCardProps[]>(API_URL + "/ads");
        setAds(result.data);
        console.log(ads)
        } catch (err) {
        console.log("erreur",err);
      }
    };
  fetchData();
  }, []
  );
  return (
<>
    <h2>Annonces récentes</h2>
    <p>Total price: {total} €</p>
    <section className="recent-ads">
        {ads.map((ad) => (
          <div key={ad.id}>
          <AdCard
            id={ad.id}
            title={ad.title}
            price={ad.price}
            imgUrl={ad.imgUrl}
          />
          <button className="button" onClick={() => { setTotal(total + ad.price);
          }}>
            Add price to total</button>
          </div>
        ))}
      </section>
</>
)};