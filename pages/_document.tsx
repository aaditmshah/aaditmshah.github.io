import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => (
  <Html lang="en" className="h-full">
    <Head>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </Head>
    <body className="h-full">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
