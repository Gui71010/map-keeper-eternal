import { motion } from 'framer-motion';

const SpaceDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Large floating geometric shapes */}
      <motion.div
        animate={{ y: [-30, 30, -30], x: [-15, 15, -15], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] left-[10%] w-16 h-16 border-2 border-cyan-400/20 rounded-lg"
        style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)' }}
      />
      <motion.div
        animate={{ y: [20, -40, 20], rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[15%] right-[15%] w-20 h-20 border-2 border-emerald-400/20"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', boxShadow: '0 0 25px rgba(52, 211, 153, 0.1)' }}
      />
      <motion.div
        animate={{ y: [-25, 35, -25], x: [10, -20, 10] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[30%] left-[75%] w-12 h-12 border-2 border-violet-400/25 rounded-full"
        style={{ boxShadow: '0 0 20px rgba(167, 139, 250, 0.15)' }}
      />
      <motion.div
        animate={{ rotate: 360, y: [-20, 20, -20] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[25%] left-[30%] w-14 h-14 border-2 border-amber-400/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)' }}
      />
      <motion.div
        animate={{ y: [15, -30, 15], x: [-12, 18, -12], rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[50%] left-[5%] w-18 h-18 border-2 border-teal-400/20 rounded-lg"
        style={{ width: '4.5rem', height: '4.5rem', boxShadow: '0 0 25px rgba(45, 212, 191, 0.1)' }}
      />
      <motion.div
        animate={{ y: [-20, 25, -20], rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[45%] right-[8%] w-16 h-16 border-2 border-blue-400/25"
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', boxShadow: '0 0 25px rgba(96, 165, 250, 0.15)' }}
      />
      <motion.div
        animate={{ y: [10, -35, 10], x: [8, -15, 8] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute top-[65%] left-[20%] w-10 h-10 border-2 border-pink-400/20"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', boxShadow: '0 0 15px rgba(244, 114, 182, 0.1)' }}
      />
      <motion.div
        animate={{ rotate: -360, y: [-15, 25, -15] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[70%] right-[25%] w-14 h-14 border-2 border-cyan-400/20 rounded-full"
        style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)' }}
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [-10, 15, -10], rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[85%] left-[50%] w-12 h-12 border-2 border-emerald-400/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', boxShadow: '0 0 20px rgba(52, 211, 153, 0.1)' }}
      />
      <motion.div
        animate={{ y: [-25, 20, -25], rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute top-[5%] left-[50%] w-10 h-10 border-2 border-violet-400/20 rounded-lg"
        style={{ boxShadow: '0 0 15px rgba(167, 139, 250, 0.1)' }}
      />

      {/* Floating orbs with glow */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[12%] left-[40%] w-3 h-3 rounded-full bg-cyan-400/40"
        style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)' }}
      />
      <motion.div
        animate={{ y: [15, -25, 15], x: [5, -15, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[40%] right-[35%] w-4 h-4 rounded-full bg-emerald-400/35"
        style={{ boxShadow: '0 0 20px rgba(52, 211, 153, 0.25)' }}
      />
      <motion.div
        animate={{ y: [-15, 25, -15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[60%] left-[60%] w-3 h-3 rounded-full bg-violet-400/35"
        style={{ boxShadow: '0 0 15px rgba(167, 139, 250, 0.25)' }}
      />
      <motion.div
        animate={{ y: [10, -20, 10], x: [-8, 12, -8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[80%] left-[85%] w-3.5 h-3.5 rounded-full bg-amber-400/40"
        style={{ boxShadow: '0 0 18px rgba(251, 191, 36, 0.3)' }}
      />
      <motion.div
        animate={{ y: [-12, 18, -12] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[90%] left-[15%] w-2.5 h-2.5 rounded-full bg-teal-400/35"
        style={{ boxShadow: '0 0 12px rgba(45, 212, 191, 0.25)' }}
      />
      <motion.div
        animate={{ y: [8, -16, 8], x: [6, -10, 6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[35%] left-[90%] w-2.5 h-2.5 rounded-full bg-blue-400/35"
        style={{ boxShadow: '0 0 12px rgba(96, 165, 250, 0.25)' }}
      />
    </div>
  );
};

export default SpaceDecorations;
