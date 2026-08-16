# Plan

A loose roadmap for reviving the project. Items are roughly ordered, nothing
here is a promise.

## Core package (`packages/occasionner`)

- [ ] **Milestone significance.** The legacy UI had a noise-level toggle
      (from ‘bare minimum’ to ‘anything goes’). Attach a significance rank to
      each milestone — e.g. one significant digit beats two, 10 000 000 beats
      98 000 000 — so that consumers can filter or style output without
      recomputing.
- [ ] **Grouping of coinciding milestones.** The same event can hit several
      round values at the same instant (90 000 hours = 5 400 000 minutes).
      Return such milestones as one group (or mark them as siblings) instead
      of duplicate rows.
- [ ] **Event config schema.** A validated config format (events + per-event
      overrides such as `minValues`), so that the frontend, bots and CLI all
      read the same file. Probably a `defineConfig()` helper + schema
      validation with helpful errors.
- [ ] **Edge-case policies and tests.** February 29 events, DST fall-back
      ambiguity, events in the future (countdowns?), property-based tests for
      the round-value generator and calendar arithmetic.
- [ ] **Formatting helpers.** Human-readable values (thin-space thousands
      separators as in the legacy UI), unit labels with pluralization (en/ru),
      relative descriptions (‘in 3 days’). Could be a submodule
      (`occasionner/format`) to keep the core dependency-free.

## Apps (`apps/*`)

- [ ] **Web frontend.** The two legacy views: calendar (months grid) and feed
      (chronological list), driven by a config file. Static build first —
      no backend needed for a personal deployment.
- [ ] **Telegram bot.** Daily digest of today’s and upcoming milestones;
      probably a scheduled job rather than a long-running process.
- [ ] **iCal feed.** An `.ics` generator so that milestones show up in any
      calendar app without a custom UI.

## Chores

- [ ] Port the events from the legacy project’s config into the new format.
- [ ] Unblock the held-back majors when the ecosystem catches up: eslint 10
      and typescript 7 (native) both wait on typescript-eslint support.
- [ ] README badges (npm version, CI) and a minimal usage section at the repo
      root once the config format settles.
