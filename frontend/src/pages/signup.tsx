import { Layout } from "@/components/Layout";
import { mutationSignup } from "@/graphql/mutationSignup";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signup(): React.ReactNode {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const [doSignup, { error }] = useMutation(mutationSignup);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await doSignup({
        variables: {
          data: {
            email,
            password,
          },
        },
      });

      if (data.item) {
        router.replace("/signin");
      }
    } catch {}
  }

  return (
    <Layout title="Inscription">
      <main className="main-content-signup">
        <div className="signup-container">
          {error && (
            <p className="error-message">
              Compte déjà existant ou mot de passe trop faible
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
              Je m'inscris
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
}