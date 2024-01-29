import { Layout } from "@/components/Layout";
import { queryMe } from "@/graphql/queryMe";
import { useQuery } from "@apollo/client";
import { UserType } from "@/types";

export default function Me(): React.ReactNode {
    const { data: meData } = useQuery<{ item: UserType | null }>(queryMe);
    const me = meData?.item;
  
    return (
      <Layout title="Mon profile">
        <main className="main-content">
          <p>Mon adresse est : {me?.email}</p>
        </main>
      </Layout>
    );
  }
