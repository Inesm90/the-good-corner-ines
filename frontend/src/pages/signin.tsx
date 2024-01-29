import { Layout } from "@/components/Layout";
import { mutationSignin } from "@/graphql/mutationSignin";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signin(): React.ReactNode {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const [doSignin, { error }] = useMutation(mutationSignin);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await doSignin({
        variables: {
            email,
            password,
          },
        });

      if (data.item) {
        router.replace("/");
      }
    } catch {}
  }

  return (
    <Layout title="Connexion">
      <main className="main-content-signup">
        <div className="signup-container">
          {error && (
            <p className="error-message">
              Une erreur est survenue
            </p>
          )}
          <form onSubmit={onSubmit} className="signup-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="form-input"
            />
            <button type="submit" className="submit-button">
              Connexion
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
}