# SA7TEC SEO and Google Setup

This document explains how to make the SA7TEC website discoverable in Google, measure traffic, and maintain the Blog correctly after deployment.

## What is already implemented

The website now includes page-specific titles and descriptions, canonical URLs, Open Graph and Twitter metadata, English language metadata, `robots.txt`, an XML sitemap, Organization and WebSite JSON-LD on the home page, CollectionPage JSON-LD on the Blog page, and a public sitemap entry for `/blog`.

The Blog is a normal, indexable page on the SA7TEC domain. Its case studies can continue linking to Medium. You do **not** need to move the Blog to Blogger or create a separate Google blog. Google can index the SA7TEC Blog and the linked Medium articles independently, provided that the pages are public and useful.

## 1. Google Search Console

Open [Google Search Console](https://search.google.com/search-console/about) and add `https://sa7tec.com/` as a URL-prefix property, or add the domain property if you control DNS. Verify ownership using the DNS TXT record recommended by Google, then deploy the site.

After deployment, submit:

```text
https://sa7tec.com/sitemap.xml
```

Use the URL Inspection tool to request indexing for these important pages:

```text
https://sa7tec.com/
https://sa7tec.com/blog
https://sa7tec.com/contact
```

Search Console is the place to monitor indexing, search queries, Core Web Vitals, mobile usability, and structured-data warnings. Google does not guarantee an immediate ranking change after a sitemap submission; the sitemap helps discovery, while useful content, authority, performance, and technical quality influence results. See Google’s [Search Console documentation](https://developers.google.com/search/docs/monitor-debug/search-console-start) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## 2. Google Analytics 4

Create a GA4 property at [Google Analytics](https://analytics.google.com/), create a Web data stream for `https://sa7tec.com`, and copy the Measurement ID, which looks like `G-XXXXXXXXXX`.

The project already has a consent-aware analytics helper. Add the Measurement ID through the project’s supported analytics configuration rather than inserting an arbitrary script into page content. If the hosting environment provides a secret or public environment-variable field for analytics, use that value and redeploy.

Before collecting visitor data, keep the cookie-consent banner enabled and publish a privacy policy appropriate for the countries where SA7TEC operates. Test the installation with Google Analytics Realtime and the browser network panel. Refer to Google’s [GA4 setup documentation](https://support.google.com/analytics/answer/9304153).

## 3. Search-friendly Blog workflow

For every new case study, use one clear English title, one unique meta description, a descriptive URL slug, a short introduction, meaningful headings, and original images with useful `alt` text. Link the article from `/blog`, and link the article to a relevant service or Contact page when that is genuinely useful to readers.

Avoid publishing duplicate copies of the same article on SA7TEC and Medium at the same time without a canonical strategy. If the same article exists on both domains, decide which version should be primary and use a canonical link where the publishing platform supports it. Do not fill pages with repeated keywords or thin AI-generated text; write for a real reader first.

Google can understand the existing Blog as a collection page through JSON-LD. If individual articles later become first-class SA7TEC routes, add `Article` or `BlogPosting` structured data to each article with its headline, author, datePublished, dateModified, image, and canonical URL. Follow Google’s [Article structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/article).

## 4. Local validation before deployment

Run the following commands from the project directory:

```bash
npx tsc --noEmit
npm run build
```

After deployment, validate the public URLs with:

- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly checks in Search Console](https://search.google.com/search-console)

The production site must serve the sitemap at `/sitemap.xml`, the crawler rules at `/robots.txt`, and the canonical domain over HTTPS.

## References

[1]: https://developers.google.com/search/docs/monitor-debug/search-console-start "Google Search Console documentation"

[2]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview "Google sitemap documentation"

[3]: https://support.google.com/analytics/answer/9304153 "Google Analytics setup documentation"

[4]: https://developers.google.com/search/docs/appearance/structured-data/article "Google Article structured-data documentation"

[5]: https://search.google.com/test/rich-results "Google Rich Results Test"

[6]: https://pagespeed.web.dev/ "Google PageSpeed Insights"
