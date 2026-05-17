import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`glass-card rounded-2xl p-6 ${type === 'card' ? 'h-[280px]' : 'h-[200px]'} flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-20 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
                <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
              </div>
            </div>
            <div className="w-3/4 h-6 rounded-md bg-white/10 animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="w-full h-4 rounded-md bg-white/5 animate-pulse" />
              <div className="w-5/6 h-4 rounded-md bg-white/5 animate-pulse" />
              {type === 'card' && <div className="w-4/6 h-4 rounded-md bg-white/5 animate-pulse" />}
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <div className="flex gap-2">
              <div className="w-16 h-5 rounded-md bg-white/10 animate-pulse" />
              <div className="w-16 h-5 rounded-md bg-white/10 animate-pulse" />
            </div>
            <div className="w-20 h-5 rounded-md bg-white/10 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
