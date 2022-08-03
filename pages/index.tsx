import {
  faGithub,
  faStackOverflow,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { assets } from "../assets";

const Home: NextPage = () => {
  return (
    <article className="h-full flex flex-col justify-center items-center text-center p-4">
      <header className="flex flex-col items-center">
        <Image
          src={assets.aaditmshah || ""}
          alt="Profile Picture of Aadit M Shah"
          width={220}
          height={220}
          quality={100}
          layout="fixed"
          className="rounded-full"
          priority
        />
        <Head>
          <title>Aadit M Shah</title>
        </Head>
        <h1 className="mt-4 text-4xl font-bold">Aadit M Shah</h1>
        <p className="text-2xl">Open-Source Developer</p>
      </header>
      <p className="mt-6">
        I build JavaScript libraries and ❤️ functional programming.
      </p>
      <nav className="mt-8 w-full flex flex-wrap gap-x-8 gap-y-6 justify-center">
        <a href="https://github.com/aaditmshah" className="flex">
          <FontAwesomeIcon icon={faGithub} className="h-7 w-7" />
          <h2 className="ml-1 text-xl font-bold">GitHub</h2>
        </a>
        <a href="https://stackoverflow.com/u/783743" className="flex">
          <FontAwesomeIcon icon={faStackOverflow} className="h-7 w-7" />
          <h2 className="ml-1 text-xl font-bold">Stack Overflow</h2>
        </a>
        <a href="https://twitter.com/zcombinator" className="flex">
          <FontAwesomeIcon icon={faTwitter} className="h-7 w-7" />
          <h2 className="ml-1 text-xl font-bold">Twitter</h2>
        </a>
      </nav>
      <p className="mt-8">A type check a day keeps the 🐞 away!</p>
    </article>
  );
};

export default Home;
