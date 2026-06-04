import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';

export function RadialProgress({ value = 0, size = 80, color = '#2E83F5', label = '' }) {
  const data = [{ value: Math.max(0, Math.min(100, value)) }];

  return (
    <div className={cn('relative inline-flex items-center justify-center')} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="75%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={999} fill={color} background={{ fill: 'rgba(148,163,184,0.15)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-sm font-semibold text-[rgb(var(--text))]">{Math.round(value)}%</div>
        {label ? <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div> : null}
      </div>
    </div>
  );
}
