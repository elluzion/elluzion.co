## Getting Started

### Required .env.local variables:

```bash
SPOTIFY_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the development server using:

```bash
bun dev

# alternatively
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## To update types

```bash
bunx supabase gen types typescript --project-id "vqshuekoluutdogfxqnv" --schema public > src/types/supabase.ts
```
