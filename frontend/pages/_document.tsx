import NavBar from "@/components/NavBar";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head 
        title="zkfetch - demo app"
        about="zkfetch demo app"
        
      />
      <meta property="og:title" content="zkfetch - demo app" />
      <meta property="og:description" content="zkfetch demo app" />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
