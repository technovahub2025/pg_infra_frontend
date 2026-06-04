import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';

export function EngineerUtilizationChart({ data = [] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Engineer Utilization</CardTitle></CardHeader>
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="projects" fill="#3b82f6" />
            <Bar dataKey="hours" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
