# Big Glow Day — bigglowday.com

The perfume storefront (men's and women's fragrances, Armenia). A separate
product from the casino sites in this folder: it reads the Laravel
`/api/perfume/public/*` API (backend `app/Perfume`) with `X-Perfume-Key`, and
is managed from the admin's **Big Glow Day** section. See `docs/PERFUME.md`.

```bash
cp .env.example .env.local   # fill PERFUME_API_KEY / PERFUME_REVALIDATE_SECRET from the backend .env
pnpm install
pnpm dev                      # http://localhost:3015
pnpm build
```
