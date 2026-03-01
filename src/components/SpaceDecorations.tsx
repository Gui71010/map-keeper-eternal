import { motion } from 'framer-motion';

const SpaceDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Floating colored orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[8%] w-2 h-2 rounded-full bg-blue-400/30 shadow-lg shadow-blue-400/20"
      />
      <motion.div
        animate={{ y: [15, -25, 15], x: [5, -15, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[35%] right-[12%] w-3 h-3 rounded-full bg-emerald-400/25 shadow-lg shadow-emerald-400/15"
      />
      <motion.div
        animate={{ y: [-15, 25, -15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[55%] left-[15%] w-2.5 h-2.5 rounded-full bg-violet-400/25 shadow-lg shadow-violet-400/15"
      />
      <motion.div
        animate={{ y: [10, -20, 10], x: [-8, 12, -8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[75%] right-[20%] w-2 h-2 rounded-full bg-amber-400/30 shadow-lg shadow-amber-400/20"
      />
      <motion.div
        animate={{ y: [-12, 18, -12] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[25%] left-[45%] w-1.5 h-1.5 rounded-full bg-cyan-400/25"
      />
      <motion.div
        animate={{ y: [8, -16, 8], x: [6, -10, 6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[65%] left-[70%] w-2 h-2 rounded-full bg-teal-400/20"
      />

      {/* Geometric shapes with glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] right-[25%] w-8 h-8 border border-blue-500/10 rounded-lg"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[45%] left-[5%] w-6 h-6 border border-emerald-500/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[80%] right-[8%] w-10 h-10 border border-violet-500/8"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[60%] w-7 h-7 border border-amber-500/10"
        style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
      />
    </div>
  );
};

export default SpaceDecorations;
