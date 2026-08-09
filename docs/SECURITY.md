# SA7TEC Security Notes

This project includes practical protections for a public client-side website and contact form. These controls reduce common abuse, but a browser-only application cannot provide the same protection as a server-side API. The strongest long-term architecture is a server endpoint protected by server-side validation, rate limiting, logging, and bot protection.

## Protections now included

| Protection | Purpose |
|---|---|
| Strict input normalization and validation | Limits field lengths, validates email format, removes control characters, and rejects malformed contact data before it reaches EmailJS. |
| Versioned client-side rate limiting | Limits valid contact attempts in the browser and prevents stale local limits from older builds from blocking the current form. |
| Honeypot field | Detects simple bots that populate a hidden field that normal users never see. |
| Minimum interaction time | Rejects unrealistically fast form submissions that are typical of basic automation. |
| EmailJS configuration separation | Keeps the Service ID, Template ID, and public key in environment configuration rather than hard-coding them in page markup. |
| Content Security Policy | Restricts scripts, styles, fonts, images, network connections, frames, workers, object embeds, and form destinations to the required sources. |
| Clickjacking protection | `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent the site from being embedded in hostile frames. |
| Transport and browser policies | HTTPS enforcement, MIME sniffing protection, strict referrer policy, Permissions Policy, and Cross-Origin Opener Policy are enabled through `public/_headers`. |
| Private route exclusion | `/admin/` is disallowed in `robots.txt` and is not included in the public sitemap. |

## Important limitation: the EmailJS public key

The EmailJS Public Key is designed to be used in frontend applications, so it is not a server secret. Do not put an EmailJS private key, SMTP password, database password, or administrator credential in `.env.local` values that are bundled into the browser.

Because this form calls EmailJS from the browser, the client-side limiter and honeypot can be bypassed by a determined attacker. They are useful friction, not a complete anti-spam system. If spam becomes a problem, move the submission flow to a server-side endpoint and add a provider such as Cloudflare Turnstile or another CAPTCHA alternative. Verify the challenge server-side before calling EmailJS.

## Deployment checklist

Before publishing, confirm that the production host serves `public/_headers` as response headers. Check the deployed response with:

```bash
curl -I https://sa7tec.com/
```

The response should include at least `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`.

Keep dependencies updated and inspect dependency changes before installation. Run:

```bash
npm audit
npx tsc --noEmit
npm run build
```

Never commit real private credentials. The current `.gitignore` should exclude local environment files; keep `.env.example` limited to variable names and safe placeholders.

## Operational recommendations

Use a managed host or CDN with DDoS protection, HTTPS, access logs, and configurable request limits. Protect the admin area with strong, unique credentials and multi-factor authentication where the hosting platform supports it. Do not expose admin routes in navigation or sitemap files. Review EmailJS delivery logs periodically and rotate credentials if a credential is accidentally exposed.

For general secure-development guidance, consult the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
