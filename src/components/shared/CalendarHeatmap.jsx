import { TimesheetCalendar } from '../timer/TimesheetCalendar';

export function CalendarHeatmap({ dailySummary = [] }) {
  return <TimesheetCalendar dailySummary={dailySummary} />;
}
