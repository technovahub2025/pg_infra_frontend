import { motion } from 'framer-motion';
import { BadgeDollarSign, BarChart3, Clock3, ReceiptText, Users, FolderKanban } from 'lucide-react';
import { KPICard } from './KPICard';
import { staggerContainer, staggerItem } from '../../utils/motionVariants';

const ICON_MAP = {
  totalProjects: FolderKanban,
  activeTasks: BarChart3,
  totalEmployees: Users,
  revenue: BadgeDollarSign,
  billableHours: Clock3,
  pendingInvoices: ReceiptText,
};

const TONE_MAP = {
  totalProjects: 'blue',
  activeTasks: 'violet',
  totalEmployees: 'cyan',
  revenue: 'green',
  billableHours: 'amber',
  pendingInvoices: 'rose',
};

export function KPISection({ items = [] }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => {
        const Icon = ICON_MAP[item.key];
        return (
          <motion.div key={item.key} variants={staggerItem}>
            <KPICard
              title={item.title}
              value={item.value}
              previousValue={item.previousValue}
              trend={item.trend}
              trendLabel={item.trendLabel}
              icon={Icon}
              tone={TONE_MAP[item.key] || 'blue'}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

