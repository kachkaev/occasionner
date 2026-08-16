# Occasionner

Work in progress: a from-scratch rewrite of an old hobby project that tracks
‘round’ anniversaries of personal events (e.g. 10 000 000 seconds or 600 weeks
since something memorable happened).

Monorepo layout:

- [`packages/occasionner`](packages/occasionner) — core logic for computing
  past and upcoming milestones from a list of events (TypeScript, published
  to npm via changesets)
- `apps/*` (planned) — consumers of the core package: a web frontend,
  Telegram bots and other integrations
