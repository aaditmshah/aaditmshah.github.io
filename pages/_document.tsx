import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => (
  /* eslint-disable-next-line react/forbid-component-props -- External Component */
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

// eslint-disable-next-line import/no-unused-modules -- Next.js Custom Document
export default MyDocument;
