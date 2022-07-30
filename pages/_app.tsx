import classNames from "classnames";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Link from "next/link";
import Favicon from "../public/favicon.svg";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const mainNav = Object.entries({
    Home: "/",
    Blog: "/blog",
    Sponsor: "/sponsor",
    Patrons: "/patrons",
    About: "/about",
    Contact: "/contact",
  });

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-dark">
        <div className="sm:flex sm:justify-between sm:max-w-3xl sm:mx-auto sm:px-2">
          <header className="flex justify-center py-1 sm:py-2">
            <Favicon className="h-7 w-7 sm:h-8 sm:w-8" />
            <h1 className="ml-1 text-xl font-bold sm:ml-2 sm:text-2xl">
              <span className="text-yellow">Aadit</span>&nbsp;
              <span className="text-orange">Codes</span>
            </h1>
          </header>
          <nav className="flex gap-x-1 overflow-x-scroll sm:overflow-x-auto text-dark">
            <h1 className="sr-only">Main Navigation</h1>
            {mainNav.map(([name, href], index) => {
              return (
                <Link key={name} href={href}>
                  <a
                    className={classNames(
                      "px-2 py-1 rounded-t-md text-sm sm:mt-4 sm:text-base font-bold",
                      router.pathname === href
                        ? "bg-yellow"
                        : "bg-orange hover:bg-yellow",
                      {
                        "ml-auto": index === 0,
                        "mr-auto": index === mainNav.length - 1,
                      }
                    )}
                  >
                    <h2>{name}</h2>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="grow flex justify-center text-dark bg-yellow">
        <div className="grow flex sm:max-w-3xl">
          <main className="grow rounded-md mx-2 my-4 bg-white">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
      <footer className="py-2 text-sm text-center text-yellow bg-dark">
        ©2022 Aadit M Shah
      </footer>
    </div>
  );
}

export default MyApp;
