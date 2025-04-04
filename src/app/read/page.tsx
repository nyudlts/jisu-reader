"use client";

import { useEffect, useState } from "react";

import { HttpFetcher } from "@readium/shared";
import { Link } from "@readium/shared";

import "../app.css";

import dynamic from "next/dynamic";
const Reader = dynamic<{ rawManifest: object; selfHref: string, locatorParam:string }>(() => import("../../components/Reader").then((mod) => mod.Reader), { ssr: false });

import { Loader } from "@/components/Loader";

import { useTheming } from "@/hooks/useTheming";

import { useAppSelector } from "@/lib/hooks";

// TODO page metadata w/ generateMetadata

export default function ReaderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [isClient, setIsClient] = useState(false);
  const [params, setParams] = useState<{ [key: string]: string | string[] | undefined } | null>(null);
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);
  const [locatorParam, setLocatorParam] = useState<string>("");
  

  const readerIsLoading = useAppSelector(state => state.reader.isLoading);

  // Init theming (breakpoints, theme, media queries…)
  const theming = useTheming();

  useEffect(() => {
    setIsClient(true);
    searchParams.then((params) => setParams(params));
  }, [searchParams]);

  useEffect(() => {
    if (params && isClient) {
      let book = "moby-dick";
      let publicationURL = "";
      if (params["book"]) {
        book = Array.isArray(params["book"]) ? params["book"][0] : params["book"];
      }

      // NYU Press get locator/deep link from Url param 
      let nyuLocator = "";
      if (params["locator"]) {
        nyuLocator = Array.isArray(params["locator"]) ? params["locator"][0] : params["locator"];
        setLocatorParam(nyuLocator);
      }
      
      if (book.startsWith("http://") || book.startsWith("https://")) {
        // TODO: use URL.canParse()
        publicationURL = book;
        if (!book.endsWith("manifest.json") && !book.endsWith("/"))
          publicationURL += "/";
      } else {
        throw new Error("book parameter is required");
      }
  
      const manifestLink = new Link({ href: "manifest.json" });
      const fetcher = new HttpFetcher(undefined, publicationURL);
      const fetched = fetcher.get(manifestLink);
      fetched.link().then((link) => {
        setSelfLink(link.toURL(publicationURL));
      });

      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ publicationURL }: ${ error.message }`);
      });
    }
  }, [params, isClient]);

  return (
    <>
    { error 
      ? <span>{ error }</span> 
      : <Loader isLoading={ readerIsLoading }>
          { isClient && manifest && selfLink && <Reader rawManifest={ manifest } selfHref={ selfLink } locatorParam={locatorParam} /> }
        </Loader>        
    }
    </>
  );
}