import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Head from "next/head";

const Contact: NextPage = () => (
  <div className="h-full flex justify-center items-center">
    <article className="max-w-full p-8">
      <header>
        <Head>
          <title>Contact - Aadit M Shah</title>
        </Head>
        <h1 className="text-3xl font-bold">Contact</h1>
      </header>
      <p className="mt-4">
        You can contact me via email or WhatsApp, but please don&apos;t call me.
      </p>
      <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        <a href="mailto:aaditmshah@aadit.codes" className="flex">
          <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
          <h2 className="ml-1 text-base font-bold">aaditmshah@aadit.codes</h2>
        </a>
        <a href="https://wa.me/917400038006" className="flex">
          <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
          <h2 className="ml-1 text-base font-bold">+91 74000-38006</h2>
        </a>
      </nav>
      <p className="mt-4">
        Furthermore, please don&apos;t contact me with contract work or job
        offers.
      </p>
    </article>
  </div>
);

export default Contact;
