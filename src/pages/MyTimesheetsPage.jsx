import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import { TimesheetExplorer } from '../components/timesheets/TimesheetExplorer';

export default function MyTimesheetsPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pb-8">
      <TimesheetExplorer scope="mine" allowManualEntry />
    </motion.div>
  );
}
