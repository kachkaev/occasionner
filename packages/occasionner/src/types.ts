export type OccasionnerEvent = {
  /** Stable identifier used to reference the event in computed milestones */
  id: string;
  title: string;
  /**
   * ISO 8601 date or date-time: "2007-04-07", "2007-04-07T00:32",
   * "2007-04-07T00:32:00+03:00" or "2007-04-07T00:32:00+03:00[Europe/Moscow]".
   * A value without an offset or a time zone is interpreted in the time zone
   * passed to computeMilestones().
   */
  start: string;
};

export const milestoneUnits = [
  "seconds",
  "minutes",
  "hours",
  "days",
  "weeks",
  "months",
  "years",
] as const;

export type MilestoneUnit = (typeof milestoneUnits)[number];

export type Milestone = {
  event: OccasionnerEvent;
  unit: MilestoneUnit;
  /** Number of units since the event start, e.g. 10_000_000 (seconds) */
  value: number;
  /** ISO 8601 instant (UTC) at which the milestone occurs */
  timestamp: string;
};

export type ComputeMilestonesOptions = {
  events: readonly OccasionnerEvent[];
  /** ISO 8601 instant, inclusive */
  from: string;
  /** ISO 8601 instant, inclusive */
  to: string;
  /**
   * IANA time zone (e.g. "Europe/London") used for calendar arithmetic and for
   * event start values that carry no offset or time zone
   */
  timeZone: string;
  /**
   * Milestone values smaller than these are skipped. The defaults keep the
   * output non-noisy (see defaultMinValues); pass smaller numbers to include
   * early milestones like ‘7 days’, or Infinity to disable a unit entirely.
   */
  minValues?: Readonly<Partial<Record<MilestoneUnit, number>>>;
};
