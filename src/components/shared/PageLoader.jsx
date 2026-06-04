import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1929]">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <path d="M18 46L36 22L54 46" stroke="#2E83F5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 56L36 32L54 56" stroke="#F0A428" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          </svg>
        </motion.div>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-3 w-3 rounded-full bg-[#2E83F5]"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.12,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
