"use client";

import { FormEvent, useMemo, useState } from "react";

interface AgentLogEntry {
  stage: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface AgentResponse {
  ok: boolean;
  videoUrl?: string;
  videoId?: string;
  durationSeconds?: number;
  metadata?: {
    title: string;
    description: string;
    tags: string[];
    thumbnailPrompt: string;
  };
  logs?: AgentLogEntry[];
  error?: string;
}

const sampleScript = `Welcome back to our channel! Today we're diving into five breakthrough AI tools that will transform how you work, create, and communicate.

First up is Synapse, your personal AI project manager that monitors deadlines, drafts updates, and keeps your team aligned without the busy work.

Next is LumiCast, a voice cloning studio that turns your script into lifelike narration in minutes.

Third on the list is MotionForge, a generative video platform that animates your ideas into cinematic trailers and explainers.

Number four is Insight Loop, a research assistant that reads dozens of reports, summarizes key insights, and creates presentation-ready storyboards.

Finally, Horizon Mix automatically masters royalty-free music that adapts to the mood of your content--no audio engineering required.

Stick around to the end where we combine all five tools into an automated YouTube production pipeline you can deploy today.`;

export default function Home() {
  const [script, setScript] = useState(sampleScript);
  const [voiceId, setVoiceId] = useState("alloy");
  const [musicPrompt, setMusicPrompt] = useState("");
  const [privacyStatus, setPrivacyStatus] =
    useState<"public" | "private" | "unlisted">("private");
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedLogs = useMemo(() => {
    if (!response?.logs) return [];
    return [...response.logs].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  }, [response?.logs]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          voiceId: voiceId.trim() || undefined,
          musicPrompt: musicPrompt.trim() || undefined,
          privacyStatus,
        }),
      });

      const data = (await res.json()) as AgentResponse;
      setResponse(data);
    } catch (error) {
      setResponse({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error during request",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row">
        <section className="flex-1 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl shadow-blue-500/10 backdrop-blur">
          <header className="mb-8 space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-300/70">
              Agentic Studio
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Turn any script into a published YouTube video automatically
            </h1>
            <p className="max-w-xl text-sm text-slate-300/80">
              Paste your narrative, choose a voice, and let the multimodal agent
              synthesize narration, visuals, music, SEO metadata, and upload
              directly to your channel.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                Script
              </label>
              <textarea
                className="h-64 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
                value={script}
                onChange={(event) => setScript(event.target.value)}
                placeholder="Paste your full narration script here..."
                required
                minLength={100}
              />
              <p className="text-xs text-slate-400">
                Include stage directions or scene instructions inline--the agent
                parses them automatically.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Voice ID
                </span>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
                  value={voiceId}
                  onChange={(event) => setVoiceId(event.target.value)}
                  placeholder="alloy"
                />
                <span className="text-xs text-slate-400">
                  Provide a voice token from your TTS provider (defaults to{" "}
                  <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-[10px] text-blue-200">
                    alloy
                  </code>
                  ).
                </span>
              </label>

              <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Privacy
                </span>
                <select
                  className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
                  value={privacyStatus}
                  onChange={(event) =>
                    setPrivacyStatus(event.target.value as typeof privacyStatus)
                  }
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
                <span className="text-xs text-slate-400">
                  Default privacy setting applied during the YouTube upload.
                </span>
              </label>
            </div>

            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Music Prompt (optional)
              </span>
              <textarea
                className="h-24 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
                value={musicPrompt}
                onChange={(event) => setMusicPrompt(event.target.value)}
                placeholder="Dreamy ambient electronic atmosphere with pulsing percussion and lush pads..."
              />
              <span className="text-xs text-slate-400">
                Customize the background music vibe. Leave blank for an adaptive,
                topic-aware soundtrack.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/50"
            >
              {isSubmitting ? "Building Video..." : "Automate Production"}
              {isSubmitting && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              )}
            </button>
          </form>
        </section>

        <aside className="flex-1 space-y-6">
          <section className="h-[28rem] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-lg shadow-blue-500/5">
            <header className="border-b border-white/10 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
                Execution Timeline
              </h2>
            </header>
            <div className="h-full overflow-y-auto px-6 py-4">
              {isSubmitting && (
                <div className="flex flex-col gap-2 text-sm text-slate-300">
                  <p className="font-medium text-blue-200">
                    Agent running... this may take ~2-4 minutes.
                  </p>
                  <p className="animate-pulse text-xs text-slate-400">
                    Generating voice, sourcing footage, mixing audio, rendering,
                    and uploading.
                  </p>
                </div>
              )}
              {!isSubmitting && orderedLogs.length === 0 && (
                <p className="text-sm text-slate-400">
                  Submit a script to view a full breakdown of each automation
                  step.
                </p>
              )}
              {orderedLogs.length > 0 && (
                <ul className="space-y-4 text-sm">
                  {orderedLogs.map((log, index) => (
                    <li
                      key={`${log.timestamp}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.25em] text-blue-300">
                          {log.stage}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-100">{log.message}</p>
                      {log.data && (
                        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950/70 p-3 text-[10px] text-slate-300">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {response && (
            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-blue-500/10">
              {response.ok && response.videoUrl ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                      Published
                    </p>
                    <h3 className="text-xl font-semibold">
                      {response.metadata?.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Duration: {Math.round(response.durationSeconds ?? 0)}s
                    </p>
                  </div>
                  <a
                    href={response.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:bg-emerald-400/20"
                  >
                    View on YouTube
                  </a>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.25em] text-blue-200">
                      SEO Summary
                    </h4>
                    <p className="mt-2 max-h-32 overflow-hidden text-sm text-slate-200">
                      {response.metadata?.description}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      Tags: {response.metadata?.tags.join(", ")}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Thumbnail Prompt: {response.metadata?.thumbnailPrompt}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-300">
                    Error
                  </p>
                  <p className="text-sm text-slate-200">
                    {response.error ?? "Something went wrong."}
                  </p>
                  {response.logs && response.logs.length > 0 && (
                    <pre className="max-h-48 overflow-auto rounded-2xl bg-slate-950/70 p-4 text-[10px] text-slate-200">
                      {JSON.stringify(response.logs, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
