import { HttpFetcher } from "@readium/shared";
import { Link } from "@readium/shared";
import { Reader } from "@/components/Reader";

import StoreProvider from "../StoreProvider";

// TODO page metadata w/ generateMetadata

export default async function ReaderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  let error = "";
  const params = await searchParams;

  let book = "moby-dick";
  let publicationURL = "";
  if (params["book"]) {
    book = Array.isArray(params["book"]) ? params["book"][0] : params["book"];
  }
  if (book.startsWith("http://") || book.startsWith("https://")) {
    // TODO: use URL.canParse()
    publicationURL = book;
    if (!book.endsWith("manifest.json") && !book.endsWith("/"))
      publicationURL += "/";
  } else
    throw new Error("book parameter is required");

  const manifestLink = new Link({ href: "manifest.json" });
  const fetcher = new HttpFetcher(fetch, publicationURL);
  const fetched = fetcher.get(manifestLink);
  const selfLink = (await fetched.link()).toURL(publicationURL)!;

  // NYU Press get locator/deep link from Url param 
  let locatorParam = "";
  if (params["locator"]) {
    locatorParam = Array.isArray(params["locator"]) ? params["locator"][0] : params["locator"];
  }

  let manifest: object | undefined;
  try {
    manifest = await fetched.readAsJSON() as object;
  } catch (error) {
    console.error("Error loading manifest", error);
    error = `Failed loading manifest ${selfLink}`;
  }

  return (
    <>
    { error 
      ? <span>{error}</span> 
      : manifest 
        ? <StoreProvider>
            <Reader rawManifest={manifest} selfHref={selfLink} locatorParam={locatorParam} />
          </StoreProvider> 
        : "Loading..."
    }
    </>
  );
}