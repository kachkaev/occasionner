# Occasionner

Computes ‘round’ anniversaries (milestones) of personal events: 10 000 000
seconds since a housewarming, 600 weeks since a wedding, 40 years since a
birthday and so on.

## Usage

```ts
import { computeMilestones } from "occasionner";

const milestones = computeMilestones({
  events: [
    { id: "housewarming", title: "Housewarming", start: "2023-09-01T18:00" },
  ],
  from: "2026-08-01T00:00:00Z",
  to: "2026-09-01T00:00:00Z",
  timeZone: "Europe/London",
});
// → [
//   { event, unit: "seconds", value: 92_000_000, timestamp: "2026-08-01T12:33:20Z" },
//   { event, unit: "months", value: 35, timestamp: "2026-08-01T17:00:00Z" },
//   …
// ]
```

## Rules

- Milestone values are round numbers: positive integers with at most two
  significant digits (1, 2 … 9, 10, 11 … 99, 100, 110 … 990, 1000, 1100 …).
- Values below per-unit minimums are skipped so that the output is not
  dominated by tiny anniversaries. The defaults are 1 000 000 seconds,
  100 000 minutes, 1000 hours, 100 days, 10 weeks, 1 month and 1 year;
  override them via the `minValues` option.
- Seconds, minutes and hours are added as exact time. Days, weeks, months and
  years follow the calendar in the event’s time zone, so milestones respect
  daylight saving time shifts and month-end clamping (e.g. January 31 plus one
  month is February 28 or 29).
- An event `start` may be a plain date ("2007-04-07"), a date-time
  ("2007-04-07T00:32"), or carry an explicit offset or time zone
  ("2007-04-07T00:32:00+03:00[Europe/Moscow]"). Plain values are interpreted
  in the `timeZone` passed to `computeMilestones()`.
