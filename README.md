<p align="center">
	<a href="https://gitmoji.dev">
		<img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
			 alt="Gitmoji">
	</a>
</p>

### Required .env.local variables:

```bash
SPOTIFY_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
```

Run the development server using:

```bash
bun dev

# alternatively
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Add all environment variables to .env.test

## To update types

```bash
bunx supabase gen types typescript --project-id "PROJECTID" --schema public > src/types/supabase.ts
```
