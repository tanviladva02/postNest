'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
  category?: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
  className?: string;
}

export default function FaqAccordion({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = '',
}: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex !== null && defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((i) => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      if (openIndexes.includes(index)) {
        setOpenIndexes([]);
      } else {
        setOpenIndexes([index]);
      }
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);

        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-orange-500/40 bg-white dark:bg-slate-900/80 shadow-md shadow-orange-500/5 ring-1 ring-orange-500/20'
                : 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/70'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              aria-expanded={isOpen}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors duration-300 ${
                    isOpen
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="space-y-0.5">
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {item.category}
                    </span>
                  )}
                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors duration-200 ${
                      isOpen
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.q}
                  </h3>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 rotate-180'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rotate-0'
                }`}
              >
                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
              </div>
            </button>

            {/* Smooth CSS Grid Accordion Transition */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mt-2">
                  <div className="pt-3">{item.a}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
