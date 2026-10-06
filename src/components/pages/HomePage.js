'use client';

import { useState, useEffect } from 'react';
import { Hero, Section } from '@/components/layout';
import {
  ProductGrid,
  CategoryGrid,
  FeatureGrid,
  PromoCard,
} from '@/components/products';
import { getFeaturedProducts } from '@/lib/productsData';
import { useAdmin } from '@/lib/AdminContext';

const mockProducts = getFeaturedProducts(8);

// Animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoomInFade {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes rotateInFade {
    from {
      opacity: 0;
      transform: scale(0.85) rotateZ(-5deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateZ(0deg);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-slide-down-fade {
    animation: slideDownFade 0.8s ease-out forwards;
  }

  .animate-slide-up-fade {
    animation: slideUpFade 0.8s ease-out forwards;
  }

  .animate-zoom-in-fade {
    animation: zoomInFade 0.8s ease-out forwards;
  }

  .animate-rotate-in-fade {
    animation: rotateInFade 0.8s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }

  .stagger-children > * {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
  .stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
  .stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
  .stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
  .stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
  .stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
`;

const mockFeatures = [
  {
    icon: '🌿',
    title: 'Authentic Products',
    description: 'Sourced directly from certified Ayurvedic manufacturers.',
  },
  {
    icon: '🍃',
    title: 'Natural Ingredients',
    description: 'No synthetic fillers — plant-based formulations only.',
  },
  {
    icon: '🛡️',
    title: 'Trusted Quality',
    description: 'Every batch tested for purity and potency.',
  },
  {
    icon: '🚚',
    title: 'Convenient Shopping',
    description: 'Fast, tracked delivery across the island.',
  },
];

export default function HomePage() {
  const { categories } = useAdmin();
  const displayCategories = categories && categories.length > 0 ? categories : getDefaultCategories();
  
  // Animation state
  const [navVisible, setNavVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({
    categories: false,
    products: false,
    features: false,
    promo: false,
  });

  // Initialize animations on mount
  useEffect(() => {
    // Stagger navbar and hero animations
    setNavVisible(true);
    const heroTimer = setTimeout(() => setHeroVisible(true), 200);

    return () => clearTimeout(heroTimer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          setSectionsVisible((prev) => ({
            ...prev,
            [sectionId]: true,
          }));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe section triggers
    const sectionElements = document.querySelectorAll('[data-section]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <style>{animationStyles}</style>

      {/* Hero Section */}
      <div
        className={heroVisible ? 'animate-slide-down-fade' : 'opacity-0'}
        style={{
          animation: heroVisible ? 'slideDownFade 0.8s ease-out' : 'none',
        }}
      >
        <Hero
          badge="100% Authentic Ayurveda"
          title="Nature's Wisdom Delivered to Your Door."
          description="AyurCare brings authentic Ayurvedic and herbal wellness products, oils, teas and skincare — sourced for purity and backed by tradition."
          ctaButtons={[
            { label: 'Shop Now', variant: 'gold' },
            { label: 'Explore Categories', variant: 'green' },
          ]}
        />
      </div>

      {/* Categories Section */}
      <div
        data-section="categories"
        className={sectionsVisible.categories ? 'animate-fade-in-up' : 'opacity-0'}
        style={{
          animation: sectionsVisible.categories ? 'fadeInUp 0.6s ease-out' : 'none',
        }}
      >
        <Section title="Shop by Category" subtitle={`${displayCategories.length} collections`}>
          <div className="stagger-children">
            <CategoryGrid categories={displayCategories} />
          </div>
        </Section>
      </div>

      {/* Featured Products */}
      <div
        data-section="products"
        className={sectionsVisible.products ? 'animate-fade-in-up' : 'opacity-0'}
        style={{
          animation: sectionsVisible.products ? 'fadeInUp 0.6s ease-out' : 'none',
        }}
      >
        <Section title="Featured Products" subtitle="Bestsellers this month">
          <div className="stagger-children">
            <ProductGrid products={mockProducts} columns={4} />
          </div>
        </Section>
      </div>

      {/* Features Section */}
      <div
        data-section="features"
        className={sectionsVisible.features ? 'animate-fade-in-up' : 'opacity-0'}
        style={{
          animation: sectionsVisible.features ? 'fadeInUp 0.6s ease-out' : 'none',
        }}
      >
        <Section title="Why Choose AyurCare">
          <div className="stagger-children">
            <FeatureGrid features={mockFeatures} />
          </div>
        </Section>
      </div>

      {/* Promo Banner */}
      <div
        data-section="promo"
        className={sectionsVisible.promo ? 'animate-fade-in-up' : 'opacity-0'}
        style={{
          animation: sectionsVisible.promo ? 'fadeInUp 0.6s ease-out' : 'none',
        }}
      >
        <Section>
          <PromoCard
            title="Immunity Season Bundle"
            description="Save 20% on curated wellness kits — this week only."
            buttonLabel="Shop Now"
          />
        </Section>
      </div>
    </div>
  );
}

// Default categories fallback
function getDefaultCategories() {
  return [
    { id: 1, icon: '🌱', name: 'Herbal Supplements' },
    { id: 2, icon: '🧴', name: 'Ayurvedic Oils' },
    { id: 3, icon: '✨', name: 'Natural Skincare' },
    { id: 4, icon: '🍵', name: 'Organic Teas' },
    { id: 5, icon: '🧼', name: 'Personal Care' },
    { id: 6, icon: '🕉️', name: 'Wellness Kits' },
  ];
}
