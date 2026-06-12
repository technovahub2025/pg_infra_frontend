import { TimesheetExplorer } from '../timesheets/TimesheetExplorer';

export function EmployeeTimesheetTab({ employeeId }) {
  return <TimesheetExplorer scope="employee" employeeId={employeeId} />;
}

