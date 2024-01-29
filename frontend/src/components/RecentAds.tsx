import { useState } from "react";
import { AdCard, AdType } from "./AdCard";
import { gql, useQuery } from "@apollo/client";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export const queryAllAds = gql`
query AllAds($skip: Int, $take: Int, $where: AdsWhere) {
  items: allAds(skip: $skip, take: $take, where: $where) {
      id
      title
      price
      imgUrl
    }
    count: allAdsCount(where: $where)
  }
`;

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  const { data } = useQuery<{ items: AdType[], count: number }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
      skip: page * pageSize,
      take: pageSize,
    },
  });
  const ads = data ? data.items : [];
  const count = data ? data.count : 0;
  const pagesCount = Math.ceil(count / pageSize);

  function onPageSizeChange(newValue: number) {
    const newPagesCount = Math.ceil(count / newValue);
    if (page >= newPagesCount) {
      setPage(Math.max(newPagesCount - 1, 0));
    }
    setPageSize(newValue);
  }

  return (
    <main className="main-content">
      <h2>Toutes les annonces</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      <section className="recent-ads">
        {ads.map((item) => (
          <div key={item.id}>
            <AdCard
              id={item.id}
              title={item.title}
              price={item.price}
              imgUrl={item.imgUrl}
              link={`/ads/${item.id}`}
              description={item.description}
              category={item.category}
            />
            <button
              onClick={() => {
                addToTotal(item.price);
              }}
            >
              Ajouter {item.price}€ au total
            </button>
          </div>
        ))}
      </section>
      <div className="pagination-info">
  <div className="pagination-info-text">
    nombre total d'éléments : {count}
  </div>
  <div className="pagination-info-page-count">
    <span>Page {page + 1} sur {pagesCount}</span>
  </div>
</div>  <div className="pagination">
  <button
    className={`pagination-button ${page === 0 ? 'pagination-button-disabled' : ''}`}
    disabled={page === 0}
    onClick={() => setPage(Math.max(page - 1, 0))}
  >
    Précédent
  </button>
  {Array.from({ length: pagesCount }, (_, index) => (
    <button
      key={index}
      className={`pagination-button ${index === page ? 'pagination-button-disabled' : ''}`}
      disabled={index === page}
      onClick={() => setPage(index)}
    >
      {index + 1}
    </button>
  ))}
  <button
    className={`pagination-button ${page === pagesCount - 1 ? 'pagination-button-disabled' : ''}`}
    disabled={page === pagesCount - 1}
    onClick={() => setPage(Math.min(page + 1, pagesCount - 1))}
  >
    Suivant
  </button>
</div>
    </main>
  );
}