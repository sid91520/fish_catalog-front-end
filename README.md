# Fresh Fish Catalog — WhatsApp Only

A mobile-first fish catalog built with Next.js (App Router), Tailwind CSS and shadcn-style UI primitives. Customers browse products and enquire on WhatsApp. Data comes from the NestJS backend (`fish-catalog-backend`). Images are uploaded to Cloudinary.

## How it works

| Purpose | Mechanism |
|---|---|
| Reading data (GET) | `/api/*` route handlers; server components use the same helpers in `lib/fish-api.ts` |
| Writing data (POST, delete) | Server Actions in `app/actions/` |
| Admin session | Backend JWT stored in an httpOnly cookie (`admin_token`, 12 h) |
| Image upload | Browser → Cloudinary directly, using a signature from the backend |

The backend URL (`BACKEND_URL`) is only used on the server, so the browser never sees it.

### Routes

| Route | Description |
|---|---|
| `/` , `/products` | Public catalog (loaded from the backend) |
| `/admin` | Admin login form when logged out; add / delete fish when logged in |
| `GET /api/fish-products` | Public: list of products (proxy of the backend) |
| `GET /api/fish-products/:id` | Public: one product (`404` if missing) |
| `GET /api/admin/me` | `200 { id, email }` when logged in, otherwise `401` |
| `GET /api/cloudinary-signature` | Admin only: upload signature from the backend (`401` when logged out) |

There is no register page. Admins are created from the backend (`POST /admin/register` with the server key, see the backend README).

### Admin flow

1. Open `/admin`. If you are not logged in you only see the login form.
2. Sign in (server action → backend `POST /admin/login` → token saved in the cookie).
3. **Add fish**: pick a WebP image (max 50 KB; anything else is rejected). The browser uploads it to Cloudinary and shows a preview. Then submit the form. The server action sends `{ name, price, discountPrice, image }` to the backend `POST /fish-products`.
4. **Delete** removes the product. If the session has expired the cookie is cleared and the login form appears.

### `loading.tsx` / `error.tsx`

Present for the app root, `/products` and `/admin`: skeletons while data loads, and a "Try again" screen if the backend can't be reached.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `BACKEND_URL` | Base URL of the NestJS backend, e.g. `http://localhost:7000` (server-side only) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, digits only, e.g. `919876543210` |

Cloudinary keys are **not** needed here; they live in the backend's `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

Start the backend first. See its README for the API reference and payloads.

## Data shape

Products come from the backend as:

```json
{
  "id": 1,
  "name": "Rohu",
  "image": "https://res.cloudinary.com/<cloud>/image/upload/…/rohu.webp",
  "price": "250.00",
  "discountPrice": "220.00",
  "createdAt": "2026-09-28T10:00:00.000Z",
  "updatedAt": "2026-09-28T10:00:00.000Z"
}
```

`price` and `discountPrice` are strings (Postgres `DECIMAL`); `image` and `discountPrice` can be `null`.

## Scripts

```bash
npm run dev     # development
npm run build   # production build
npm run start   # run the production build
npm run lint
```
# fish_catalog-front-end
