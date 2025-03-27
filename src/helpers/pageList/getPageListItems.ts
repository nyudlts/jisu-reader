import { PageListItem } from "@/models/pageList";

export async function getPageListItems(url: string, samplePath: string): Promise<PageListItem[]> {
  const response = await fetch(url);
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xhtml+xml");

  // Loop through all <nav> elements and check the epub:type attribute via namespace
  const navs = Array.from(doc.getElementsByTagName("nav"));

  const epubNamespace = "http://www.idpf.org/2007/ops";
  const targetNav = navs.find(
    (nav) =>
      nav.getAttribute("role") === "doc-pagelist" &&
      nav.getAttributeNS(epubNamespace, "type") === "page-list"
  );

  if (!targetNav) {
    throw new Error("Page list navigation not found.");
  }

  const items: { id:string; title: string; href: string }[] = [];

  const liElements = targetNav.querySelectorAll("li");
  
  let idCounter = 0;
  liElements.forEach((li) => {
    const anchor = li.querySelector("a");
    if (anchor && anchor.textContent && anchor.getAttribute("href")) {
      let anchorHref = anchor.getAttribute("href")!;
      let href = rebasePath(samplePath, anchorHref);
      items.push({
        id: `page-${++idCounter}`,
        title: anchor.textContent.trim(),
        href: href,
      });
    }
  });

  return items;
}

//the nav document may not have page-list href values with the full path needed for the EpubNavigator
//so rebase the path based on the samplePath if needed
function rebasePath(toMatch: string, target: string): string {
  // Get the directory 
  const baseDir = getBasePath(toMatch);

  // Get just the filename + fragment from the target path
  const fileAndFragment = target.split("/").pop()!;

  // Return the new full path
  return `${baseDir}/${fileAndFragment}`;
}

function getBasePath(path: string): string {
  const noFragment = path.split("#")[0];
  const parts = noFragment.split("/");
  parts.pop(); // remove file
  return parts.join("/");
}