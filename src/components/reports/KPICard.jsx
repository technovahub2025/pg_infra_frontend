import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

function formatTrend(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '0%';
  return `${Math.abs(number).toFixed(number % 1 === 0 ? 0 : 1)}%`;
}

export function KPICard({
  title,
  value,
  previousValue,
  trend = 0,
  trendLabel = 'vs previous period',
  icon: Icon,
  tone = 'blue',
}) {
  const positive = Number(trend || 0) > 0;
  const neutral = Number(trend || 0) === 0;

  const toneClasses = {
    blue: 'from-sky-500/15 to-sky-500/5 text-sky-500 ring-sky-500/20',
    green: 'from-emerald-500/15 to-emerald-500/5 text-emerald-500 ring-emerald-500/20',
    amber: 'from-amber-500/15 to-amber-500/5 text-amber-500 ring-amber-500/20',
    rose: 'from-rose-500/15 to-rose-500/5 text-rose-500 ring-rose-500/20',
    violet: 'from-violet-500/15 to-violet-500/5 text-violet-500 ring-violet-500/20',
    cyan: 'from-cyan-500/15 to-cyan-500/5 text-cyan-500 ring-cyan-500/20',
  };

  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border border-[rgb(var(--line)/0.12)] shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]">
        <CardBody className="flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">{title}</p>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-[rgb(var(--text))] sm:text-[28px]">{value}</div>
            </div>
            <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ring-1', toneClasses[tone] || toneClasses.blue)}>
              {Icon ? <Icon className="h-5 w-5" /> : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-500">{trendLabel}</div>
              <div className="mt-1 text-xs text-slate-500">Previous: {previousValue}</div>
            </div>
            <Badge
              tone={positive ? 'green' : neutral ? 'slate' : 'rose'}
              className="gap-1 px-2.5 py-1 text-[11px] font-semibold"
            >
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : neutral ? <Minus className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {formatTrend(trend)}
            </Badge>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
