'use client';

import { LayoutWrapper, Section } from '@/components/layout';
import { Button } from '@/components/ui';

export default function About() {
  return (
    <LayoutWrapper>
      <Section title="About AyurCare">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--green-900)', marginTop: '20px' }}>Our Mission</h2>
          <p style={{ fontSize: '15px', color: 'var(--charcoal-60)', lineHeight: 1.8 }}>
            AyurCare is dedicated to bringing authentic Ayurvedic and herbal wellness products
            to people who seek natural, traditional remedies. We believe in the power of nature
            and the wisdom of Ayurveda to promote holistic health and wellbeing.
          </p>

          <h2 style={{ color: 'var(--green-900)', marginTop: '30px' }}>Why Choose AyurCare?</h2>
          <ul style={{ fontSize: '15px', color: 'var(--charcoal-60)', lineHeight: 1.8 }}>
            <li>100% Authentic Ayurvedic products sourced from certified manufacturers</li>
            <li>All natural ingredients with no synthetic fillers</li>
            <li>Every batch tested for purity and potency</li>
            <li>Fast, tracked delivery across the island</li>
            <li>Expert customer support and wellness guidance</li>
          </ul>

          <h2 style={{ color: 'var(--green-900)', marginTop: '30px' }}>Our Story</h2>
          <p style={{ fontSize: '15px', color: 'var(--charcoal-60)', lineHeight: 1.8 }}>
            Founded with a passion for traditional wellness, AyurCare bridges the gap between
            ancient Ayurvedic knowledge and modern convenience. We work directly with trusted
            manufacturers to ensure every product meets our strict quality standards.
          </p>

          <div style={{ marginTop: '40px' }}>
            <Button variant="primary" onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </Button>
          </div>
        </div>
      </Section>
    </LayoutWrapper>
  );
}
