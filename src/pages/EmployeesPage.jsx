import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';

export default function EmployeesPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h1 className="font-display text-3xl font-bold text-white">Employees</h1>
      <p className="mt-2 text-sm text-slate-400">Employee administration and role mapping.</p>
    </motion.div>
  );
}
