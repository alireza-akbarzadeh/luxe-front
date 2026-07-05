import type { Metadata } from 'next';

import { GoalShoppingDomain } from '@/domains/goal-shopping/goal-shopping.domain';

export const metadata: Metadata = {
  title: 'Goal-Based Shopping — Luxe',
  description: 'Describe a shopping goal and get an AI plan with product recommendations.'
};

export default function GoalShoppingPage() {
  return <GoalShoppingDomain />;
}
