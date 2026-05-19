'use clent';
import {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Empty as EmptyUI
} from '@/components/ui/empty';
import { IconBasket, type TablerIcon } from '@tabler/icons-react';
import { motion } from 'framer-motion';
interface EmptyProps {
  icon?: TablerIcon;
  title: string;
  description: string;
  content: React.ReactNode;
}
export function Empty(props: EmptyProps) {
  const { content, description, title, icon: Icon } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-16 text-center'
    >
      <EmptyUI>
        <EmptyHeader>
          <EmptyMedia variant='icon'>{Icon ? <Icon /> : <IconBasket />}</EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>{content}</EmptyContent>
      </EmptyUI>
    </motion.div>
  );
}
