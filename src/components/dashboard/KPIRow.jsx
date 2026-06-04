import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/motionVariants';
import { KPICard } from './KPICard';

export function KPIRow({ data = [] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {data.map((item) => (
        <motion.div key={item.label} variants={staggerItem}>
          <KPICard {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
