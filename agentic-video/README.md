# Agentic YouTube Producer

Autonomous Next.js agent that transforms a narration script into a fully-edited, SEO-optimized, and published YouTube video. The workflow includes:

- Scene planning and visual sourcing from Pexels
- AI voice-over synthesis
- Generative background score via MusicGen (Replicate)
- Video assembly with FFmpeg (includes subtitles & audio mixing)
- SEO metadata creation (title, description, tags, thumbnail prompt)
- Automatic upload to YouTube with configurable privacy

The project ships with a sleek control surface for triggering productions and reviewing the agent timeline.

## Getting Started

Create an environment file at the project root:

```bash
cp .env.example .env.local
```

Fill in the required credentials:

```
OPENAI_API_KEY=...
PEXELS_API_KEY=...
REPLICATE_API_TOKEN=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...
# Optional
YOUTUBE_DEFAULT_PRIVACY=private
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

| Stage | Description |
| --- | --- |
| Planning | GPT-4.1-mini splits the script into cinematic scenes with prompts + durations |
| Voice | GPT-4o-mini TTS renders narration using your configured voice token |
| Visuals | Pexels stock clips are sourced and normalized to 1280x720@30fps |
| Music | Replicate MusicGen generates adaptive background tracks |
| Assembly | FFmpeg stitches, captions, and mixes audio into a final MP4 |
| SEO | Metadata (title, description, tags, thumbnail prompt) is generated for YouTube |
| Upload | Video, metadata, and thumbnail are published via YouTube Data API |

The API route `POST /api/agent` orchestrates the entire pipeline inside a temporary workspace, cleans up artifacts, and returns execution logs plus the final YouTube URL.

## Testing the Pipeline

1. Paste or tweak the sample script on the homepage.
2. Hit **Automate Production**.
3. Monitor progress in the timeline panel.
4. Once complete, the card displays the published URL alongside generated metadata.

> ℹ️ Long-running steps (video rendering & upload) can take a few minutes depending on footage length.

## Deployment

- Ensure the environment variables are configured in Vercel.
- Run `npm run build` to verify the production build locally.
- Deploy with `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-cdc218ff`.

## Notes

- Replicate and YouTube uploads rely on pre-authorized API keys/refresh tokens. Keep them secret.
- The agent assumes the generated video stays under typical API upload limits (~128 MB). Adjust scene counts/durations if necessary.
- You can swap providers by editing the modules in `src/lib/*`.
