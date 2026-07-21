import React from 'react';

export const TextBlock = ({ content }) => (
  <div className="col-span-12 md:col-span-8 lg:col-span-9">
    <div className="bg-white p-8 md:p-10 rounded-3xl border border-outline-variant/5 shadow-sm">
      <div
        className="text-[#40484f] leading-relaxed text-sm max-w-none
          prose-headings:text-[#1a1c1d] prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-h2:text-xl prose-h2:border-b prose-h2:border-[#004b71]/10 prose-h2:pb-2
          prose-h3:text-base prose-h3:text-[#004b71]
          prose-h4:text-sm
          prose-p:mb-4 prose-p:leading-7
          prose-strong:text-[#004b71]
          prose-ul:mb-4 prose-ul:space-y-1.5
          prose-ol:mb-4 prose-ol:space-y-1.5
          prose-li:text-[#40484f]
          prose-table:w-full prose-table:border-collapse prose-table:my-6
          prose-th:bg-[#004b71] prose-th:text-white prose-th:p-2.5 prose-th:text-left prose-th:text-xs prose-th:font-bold
          prose-td:p-2.5 prose-td:border prose-td:border-[#e2e2e3] prose-td:text-sm
          prose-tr:even:bg-[#f8f8f9]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
);
