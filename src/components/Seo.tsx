import { useEffect } from "react";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  locale?: string;
  noindex?: boolean;
  structuredData?: JsonLdValue;
};

const SITE_URL = "https://sa7tec.com";
const SITE_NAME = "SA7TEC";
const DEFAULT_TITLE = "SA7TEC | Digital Product Studio";
const DEFAULT_DESCRIPTION =
  "SA7TEC builds premium mobile apps, games, AI products, SaaS platforms, and custom software for ambitious teams.";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;

function getCanonicalPath(path?: string) {
  const normalized = path ? path.replace(/\/+/g, "/") : "/";
  return `${SITE_URL}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

export function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  locale = "en_US",
  noindex = false,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const resolvedCanonical = canonical ?? getCanonicalPath(path);
    const robotsContent = noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

    document.title = title;
    document.documentElement.lang = locale.split("_")[0] || "en";

    const setMeta = (name: string, content: string, attr = "name") => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("robots", robotsContent);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", resolvedCanonical, "property");
    setMeta("og:image", image, "property");
    setMeta("og:image:alt", title, "property");
    setMeta("og:locale", locale, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setLink("canonical", resolvedCanonical);

    const existingSchema = document.querySelector('script[data-seo="jsonld"]');
    if (structuredData) {
      if (existingSchema) {
        existingSchema.remove();
      }
      const schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-seo", "jsonld");
      schemaScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(schemaScript);
    } else if (existingSchema) {
      existingSchema.remove();
    }

    return () => {
      if (existingSchema) {
        existingSchema.remove();
      }
    };
  }, [canonical, description, image, locale, noindex, path, structuredData, title, type]);

  return null;
}
