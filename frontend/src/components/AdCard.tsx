import Link from "next/link";
import { API_URL } from "@/config";
import axios from "axios";

export type AdType = {
  id:number;
  title: string;
  description: string;
  imgUrl: string;
  price: number;
  category: { id: number } | null;

};

export function AdCard(props: AdType): React.ReactNode {
  console.log(props)
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={`/ads/${props.id}`}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-description">{props.description}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </Link>
    </div>
    
  );
}