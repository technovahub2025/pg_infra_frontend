import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';

export function RevenueTrendChart({ data = [] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={3} />
            <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
