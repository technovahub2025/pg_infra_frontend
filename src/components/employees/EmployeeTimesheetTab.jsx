import { useQuery } from '@tanstack/react-query';
import { Card, CardBody } from '../ui/card';
import { CalendarHeatmap } from '../shared/CalendarHeatmap';
import { TimerLog } from '../timer/TimerLog';
import { employeeService } from '../../services/employeeService';

export function EmployeeTimesheetTab({ employeeId }) {
  const logsQuery = useQuery({
    queryKey: ['employee-timesheets', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => employeeService.timesheets(employeeId),
  });

  const logs = logsQuery.data || [];
  const dailySummary = logs.reduce((acc, log) => {
    const date = new Date(log.date || log.startTime).toISOString().slice(0, 10);
    const found = acc.find((item) => item.date === date);
    if (found) found.duration += Number(log.duration || 0);
    else acc.push({ date, duration: Number(log.duration || 0) });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <CalendarHeatmap dailySummary={dailySummary} />
      <Card>
        <CardBody className="p-0">
          <TimerLog logs={logs} />
        </CardBody>
      </Card>
    </div>
  );
}
