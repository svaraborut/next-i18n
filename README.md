# i18n

Next.js internationalization playground

https://medium.com/@ferlat.simon/internationalize-your-next-js-static-site-with-app-router-772f9f16e63

## 🐛 Known Bugs

Due to a known [BUG 899](https://github.com/cloudflare/next-on-pages/issues/899) it is fundamental to keep the Vercel
CLI explicitly at version `^35.0.0` to allow for SSG routes static generation.

For metadata generation a [Workaround](https://github.com/vercel/next.js/discussions/50189#discussioncomment-11480319)
is implied to extract current path for `hrefLang` assembly at build time.

## Strategies

- **Cookie**
- **Query**
- **URL**

## `<Link/>`

> [!WARNING]
> There are some noticeable navigation quirks where some links stop working from time to time. The
> community [claims](https://github.com/vercel/next.js/discussions/57565) it is related to prefetching, therefore
> prefetch will be disabled all together. MONITOR THIS ISSUE TO RE-ENABLE IF FIXED.

> [!TIP]
> Link has a slightly asymmetric behaviour with `defaultLanguage`. When the current language is different from the
> default all links will also include the default. This is needed and cannot be disabled.
>
> This is to solve: When a user has a cookie set to a locale (like `gr`) visiting an un-prefixed url `/article` will
> yield to a `/gr/article` redirect rather than displaying the `/article` page (in `en`) this is the expected behaviour
> unless someone is visiting `/article` to intentionally change language. Therefore, links will link to `/en/article` to
> intentionally force a language switch redirect. This prefixing will be disabled if the current locale is already `en`,
> to prevent redirects during same-language navigation on the `defaultLocale`.

## Deploy

Use wrangler to create a new project using

```shell
wrangler pages project create svara-test-i18n --production-branch main --compatibility-date 2025-01-15 --compatibility-flag nodejs_compat
```

And proceed to configure the account and paths in the final parts of
the [deployment pipeline](.github/workflows/publish.yml)

## Todo

- ✅ Migrate to [wrangler-action](https://github.com/cloudflare/pages-action)
- Add hreflang to query pages
- ✅ Add style to Markdown

## Development

### Actions of the middleware

- redirect from `/` to `/it` when the preference requires `it`
- remove unwanted URL parts (like QR strings)

### `zone.match`

Produces various values to be used by the server middleware to resolve localization redirects:

- **Display URL** the url that should be visible to the user. If it does not match the request's one the user will be
  redirected to such url.
- **Canonical URL** the url used for internal rewrites, should always match the `/[locale]/...` pattern.
- **Locale** indicating the language detected within the request url.

| Zone Type | Preference (*) | Request URL   | Display URL   | Canonical URL | Locale | Notes |
|-----------|----------------|---------------|---------------|---------------|--------|-------|
| URL       |                | `/article`    | `/article`    | `/article`    | ``     | (1)   |
| URL       |                | `/en/article` | `/article`    | `/article`    | `en`   | (2)   |
| URL       |                | `/it/article` | `/it/article` | `/article`    | `it`   |       |

(*) The preference as set by the cookie or from the preferred language headers

(1) As a locale detection is missing, if the preferred locale (*) is different from the default one. This will induce a
redirect.
