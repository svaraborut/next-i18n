# i18n

Next.js internationalization playground

https://medium.com/@ferlat.simon/internationalize-your-next-js-static-site-with-app-router-772f9f16e63

## Strategies

- **Cookie**
- **Query**
- **URL**

## Deploy

Use wrangler to create a new project using

```shell
wrangler project create svara-test-i18n --production-branch main --compatibility-date 2025-01-15 --compatibility-flag nodejs_compat
```

And proceed to configure the account and paths in the final parts of
the [deployment pipeline](.github/workflows/publish.yml)

## Todo

- Migrate to [wrangler-action](https://github.com/cloudflare/pages-action)
- Add hreflang to query pages
