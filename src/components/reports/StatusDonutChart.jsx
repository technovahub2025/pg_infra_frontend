import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function StatusDonutChart({ data = [] }) {
  const rows = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <Card>
      <CardHeader><CardTitle>Status</CardTitle></CardHeader>
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
              {rows.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
