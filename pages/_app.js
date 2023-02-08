import "../public/index.css";
import { Raleway } from "@next/font/google";

const raleway = Raleway({ subsets: ["latin"] });

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <main className={raleway.className}>
      <Component {...pageProps} />
    </main>
  );
}
