import AdForm from "@/components/AdForm";
import { Layout } from "@/components/Layout";

export default function NewAd() {
  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <AdForm />
      </main>
    </Layout>
  );
}