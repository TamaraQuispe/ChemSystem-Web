import React from 'react';
import { TextBlock } from './TextBlock';
import { HighlightCard } from './HighlightCard';
import { ImageBlock } from './ImageBlock';
import { LaboratoryCard } from './LaboratoryCard';
import { CaseStudyCard } from './CaseStudyCard';
import { GlossaryCard } from './GlossaryCard';

export const ContentBlockRenderer = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.data?.content} />;
    case 'highlight':
      return <HighlightCard text={block.data?.text} variant={block.data?.variant} />;
    case 'image':
      return <ImageBlock caption={block.data?.caption} />;
    case 'lab':
      return <LaboratoryCard data={block.data} />;
    case 'case_study':
      return <CaseStudyCard data={block.data} />;
    case 'glossary':
      return <GlossaryCard terms={block.data?.terms} />;
    default:
      return null;
  }
};
