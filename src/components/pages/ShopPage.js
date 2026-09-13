'use client';

import { Suspense } from 'react';
import { Section } from '@/components/layout';
import ShopPageContent from './ShopPageContent';

export default function ShopPage() {
  return (
    <Suspense fallback={<Section title="Loading..."><div>Loading products...</div></Section>}>
      <ShopPageContent />
    </Suspense>
  );
}
