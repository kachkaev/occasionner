import { describe, expect, it } from "vitest";

import { computeMilestones } from "./compute-milestones.ts";
import type { OccasionnerEvent } from "./types.ts";

function createEvent(start: string): OccasionnerEvent {
  return { id: "housewarming", title: "Housewarming", start };
}

describe("computeMilestones", () => {
  it("computes an exact-time milestone (1 000 000 seconds)", () => {
    const milestones = computeMilestones({
      events: [createEvent("2000-01-01T00:00:00Z")],
      from: "2000-01-12T00:00:00Z",
      to: "2000-01-13T00:00:00Z",
      timeZone: "UTC",
    });

    expect(milestones).toEqual([
      {
        event: createEvent("2000-01-01T00:00:00Z"),
        unit: "seconds",
        value: 1_000_000,
        timestamp: "2000-01-12T13:46:40Z",
      },
    ]);
  });

  it("clamps month arithmetic to the end of a shorter month", () => {
    const milestones = computeMilestones({
      events: [createEvent("2023-01-31")],
      from: "2023-02-01T00:00:00Z",
      to: "2023-03-01T00:00:00Z",
      timeZone: "UTC",
      minValues: { seconds: Number.POSITIVE_INFINITY },
    });

    expect(
      milestones.map(({ unit, value, timestamp }) => ({
        unit,
        value,
        timestamp,
      })),
    ).toEqual([
      {
        unit: "months",
        value: 1,
        timestamp: "2023-02-28T00:00:00Z",
      },
    ]);
  });

  it("respects daylight saving time for calendar units", () => {
    // Event at noon EST (UTC-5); six months later New York is on EDT (UTC-4),
    // so the milestone falls at noon local time = 16:00 UTC
    const milestones = computeMilestones({
      events: [createEvent("2023-01-01T12:00")],
      from: "2023-07-01T15:00:00Z",
      to: "2023-07-01T17:00:00Z",
      timeZone: "America/New_York",
    });

    expect(
      milestones.map(({ unit, value, timestamp }) => ({
        unit,
        value,
        timestamp,
      })),
    ).toEqual([
      {
        unit: "months",
        value: 6,
        timestamp: "2023-07-01T16:00:00Z",
      },
    ]);
  });

  it("prefers the time zone embedded in the event start", () => {
    const milestones = computeMilestones({
      events: [createEvent("2020-06-01T10:00:00+03:00[Europe/Moscow]")],
      from: "2020-07-01T00:00:00Z",
      to: "2020-07-02T00:00:00Z",
      timeZone: "UTC",
      minValues: { seconds: Number.POSITIVE_INFINITY },
    });

    expect(
      milestones.map(({ unit, value, timestamp }) => ({
        unit,
        value,
        timestamp,
      })),
    ).toEqual([
      {
        unit: "months",
        value: 1,
        timestamp: "2020-07-01T07:00:00Z",
      },
    ]);
  });

  it("skips values below default minimums, unless overridden", () => {
    const baseOptions = {
      events: [createEvent("2024-01-01T00:00:00Z")],
      from: "2024-01-02T00:00:00Z",
      to: "2024-01-08T00:00:00Z",
      timeZone: "UTC",
    };

    expect(computeMilestones(baseOptions)).toEqual([]);

    const milestones = computeMilestones({
      ...baseOptions,
      minValues: { days: 1 },
    });

    expect(milestones.map(({ unit, value }) => ({ unit, value }))).toEqual([
      { unit: "days", value: 1 },
      { unit: "days", value: 2 },
      { unit: "days", value: 3 },
      { unit: "days", value: 4 },
      { unit: "days", value: 5 },
      { unit: "days", value: 6 },
      { unit: "days", value: 7 },
    ]);
  });

  it("sorts milestones of multiple events chronologically", () => {
    const eventA: OccasionnerEvent = {
      id: "a",
      title: "Event A",
      start: "2000-01-01T00:00:00Z",
    };
    const eventB: OccasionnerEvent = {
      id: "b",
      title: "Event B",
      start: "2000-01-05T00:00:00Z",
    };

    const milestones = computeMilestones({
      events: [eventA, eventB],
      from: "2000-01-01T00:00:00Z",
      to: "2000-02-01T00:00:00Z",
      timeZone: "UTC",
      minValues: { seconds: 1_000_000, minutes: 10_000 },
    });

    const timestamps = milestones.map(({ timestamp }) => timestamp);
    expect(timestamps).toEqual([...timestamps].toSorted());
    expect(new Set(milestones.map(({ event }) => event.id))).toEqual(
      new Set(["a", "b"]),
    );
  });

  it("throws on an event start that cannot be parsed", () => {
    expect(() =>
      computeMilestones({
        events: [createEvent("not-a-date")],
        from: "2024-01-01T00:00:00Z",
        to: "2024-02-01T00:00:00Z",
        timeZone: "UTC",
      }),
    ).toThrow(/Unable to parse event start "not-a-date"/);
  });
});
