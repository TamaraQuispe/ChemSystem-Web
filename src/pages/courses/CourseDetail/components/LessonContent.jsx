import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentBlockRenderer } from './ContentBlockRenderer';
import { cn } from '../../../../utils/cn';

const ReadingProgress = ({ percent }) => (
  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-outline-variant/10 -mx-8 lg:-mx-12 px-8 lg:px-12 py-2">
    <div className="max-w-5xl mx-auto flex items-center gap-4">
      <div className="flex-1 h-1.5 bg-[#e2e2e3] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#004b71] to-[#006494] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-[#40484f]/60 whitespace-nowrap">
        {Math.round(percent)}% leído
      </span>
    </div>
  </div>
);

const EstimatedTime = ({ minutes }) => {
  if (!minutes) return null;
  const readTime = Math.max(5, Math.round(minutes * 0.6));
  const practiceTime = Math.max(3, Math.round(minutes * 0.3));
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#f3f3f4] rounded-xl text-[10px] font-bold text-[#40484f]">
      <span>📖 Lectura: {readTime} min</span>
      <span className="w-1 h-1 rounded-full bg-[#40484f]/30" />
      <span>✏️ Práctica: {practiceTime} min</span>
      <span className="w-1 h-1 rounded-full bg-[#40484f]/30" />
      <span>⏱️ Total: ~{minutes} min</span>
    </div>
  );
};

const SectionProgress = ({ blocks, currentIndex, onNavigate }) => {
  if (!blocks || blocks.length <= 1) return null;
  return (
    <div className="flex items-center gap-2 py-2 overflow-x-auto">
      {blocks.map((_, i) => (
        <button
          key={i}
          onClick={() => onNavigate?.(i)}
          className={cn(
            'shrink-0 w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center transition-all',
            i === currentIndex
              ? 'bg-[#004b71] text-white scale-110 shadow-sm'
              : i < currentIndex
                ? 'bg-[#86f8c8]/40 text-[#006c4d]'
                : 'bg-[#e2e2e3] text-[#40484f]/50 hover:bg-[#d0d0d2]'
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export const LessonContent = ({ content_blocks, durationMinutes }) => {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [readProgress, setReadProgress] = useState(0);
  const blockRefs = useRef([]);
  const observerRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (!content_blocks?.length) return;
    let totalRead = 0;
    content_blocks.forEach((_, i) => {
      const el = blockRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
          totalRead++;
        }
      }
    });
    setReadProgress((totalRead / content_blocks.length) * 100);
  }, [content_blocks]);

  useEffect(() => {
    if (!content_blocks?.length) return;
    updateProgress();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.blockIndex);
            if (!isNaN(idx)) setCurrentBlock(idx);
          }
        }
        updateProgress();
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );
    blockRefs.current.forEach(ref => {
      if (ref) observerRef.current.observe(ref);
    });
    return () => observerRef.current?.disconnect();
  }, [content_blocks, updateProgress]);

  const scrollToBlock = (index) => {
    const el = blockRefs.current[index];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!content_blocks?.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <SectionProgress
          blocks={content_blocks}
          currentIndex={currentBlock}
          onNavigate={scrollToBlock}
        />
        <EstimatedTime minutes={durationMinutes} />
      </div>

      <ReadingProgress percent={readProgress} />

      <article className="max-w-5xl">
        <div className="grid grid-cols-12 gap-5">
          {content_blocks.map((block, bi) => (
            <div
              key={bi}
              ref={el => blockRefs.current[bi] = el}
              data-block-index={bi}
              className="col-span-12"
            >
              <ContentBlockRenderer block={block} />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};
