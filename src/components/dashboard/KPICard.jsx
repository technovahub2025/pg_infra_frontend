import { motion } from 'framer-motion';
import { Card, CardBody } from '../ui/card';

export function KPICard({ label, value, sub, accent = '#2E83F5', icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
        <CardBody className="min-h-[112px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
              <div className="mt-3 whitespace-nowrap font-display text-[1.65rem] font-semibold leading-none tracking-tight text-[rgb(var(--text))] sm:text-[1.95rem]">
                {value}
              </div>
              {sub ? <div className="mt-2 text-xs text-slate-400">{sub}</div> : null}
            </div>
            {Icon ? <Icon className="h-5 w-5 opacity-20" /> : null}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
