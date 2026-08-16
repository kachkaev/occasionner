import { Temporal } from "temporal-polyfill";

import { generateRoundValues } from "./round-values.ts";
import {
  type ComputeMilestonesOptions,
  type Milestone,
  type MilestoneUnit,
  milestoneUnits,
} from "./types.ts";

/**
 * Milestone values smaller than these are skipped by default, so that the
 * output is not dominated by tiny anniversaries like ‘2 hours since X’.
 */
export const defaultMinValues: Record<MilestoneUnit, number> = {
  seconds: 1_000_000,
  minutes: 100_000,
  hours: 1000,
  days: 100,
  weeks: 10,
  months: 1,
  years: 1,
};

function parseEventStart(
  start: string,
  timeZone: string,
): Temporal.ZonedDateTime {
  try {
    return Temporal.ZonedDateTime.from(start);
  } catch {
    // Not a date-time with a bracketed time zone; keep trying other formats
  }
  try {
    return Temporal.Instant.from(start).toZonedDateTimeISO(timeZone);
  } catch {
    // Not a date-time with an offset either
  }
  try {
    return Temporal.PlainDateTime.from(start).toZonedDateTime(timeZone);
  } catch (error) {
    throw new Error(
      `Unable to parse event start ${JSON.stringify(start)} as an ISO 8601 date or date-time`,
      { cause: error },
    );
  }
}

/**
 * Computes all milestones of the given events that fall into the
 * [from, to] window (both ends inclusive), sorted chronologically.
 *
 * Milestone values are ‘round’ numbers (at most two significant digits).
 * Seconds, minutes and hours are added as exact time; days, weeks, months and
 * years follow the calendar in the event’s time zone, so milestones respect
 * daylight saving time shifts and month-end clamping (e.g. January 31 plus one
 * month is February 28 or 29).
 */
export function computeMilestones(
  options: ComputeMilestonesOptions,
): Milestone[] {
  const from = Temporal.Instant.from(options.from);
  const to = Temporal.Instant.from(options.to);
  const minValues = { ...defaultMinValues, ...options.minValues };

  const milestonesWithInstants: Array<[Temporal.Instant, Milestone]> = [];

  for (const event of options.events) {
    const eventStart = parseEventStart(event.start, options.timeZone);

    for (const unit of milestoneUnits) {
      const minValue = minValues[unit];
      if (!Number.isFinite(minValue)) {
        // Infinity disables the unit
        continue;
      }

      for (const value of generateRoundValues()) {
        if (value < minValue) {
          continue;
        }

        let occurrence: Temporal.Instant;
        try {
          occurrence = eventStart.add({ [unit]: value }).toInstant();
        } catch {
          // Beyond the range Temporal can represent, so beyond `to` as well
          break;
        }

        if (Temporal.Instant.compare(occurrence, to) > 0) {
          break;
        }
        if (Temporal.Instant.compare(occurrence, from) >= 0) {
          milestonesWithInstants.push([
            occurrence,
            { event, unit, value, timestamp: occurrence.toString() },
          ]);
        }
      }
    }
  }

  return milestonesWithInstants
    .toSorted(([a], [b]) => Temporal.Instant.compare(a, b))
    .map(([, milestone]) => milestone);
}
