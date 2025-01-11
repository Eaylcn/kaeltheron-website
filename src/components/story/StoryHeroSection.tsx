import React from 'react';
import { motion } from 'framer-motion';

export const StoryHeroSection = () => {
  return (
    <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162137] to-[#1C2B4B]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#162137]/80 to-[#1C2B4B]/90 z-10" />
        <div className="absolute inset-0 bg-[url('/story-bg.png')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl font-hennyPenny text-white mb-6 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">
            {`Kael'Theron Tarihi`}
          </h1>
          <p className="text-2xl font-risque text-gray-200 mb-8">
            Efsanevi bir dünyanın destansı hikayesi
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400/80 font-risque">
            <span className="w-12 h-[1px] bg-amber-400/40" />
            <span>Çağlar Boyunca</span>
            <span className="w-12 h-[1px] bg-amber-400/40" />
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1120] to-transparent" />
    </section>
  );
}; 