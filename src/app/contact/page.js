'use client';

import { useState } from 'react';
import { LayoutWrapper, Section } from '@/components/layout';
import { FormField, Button } from '@/components/ui';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear message when user starts typing
    if (submitMessage.text) {
      setSubmitMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage({
        type: 'error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: data.message,
        });
        // Clear form
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfoStyles = {
    section: {
      marginBottom: '30px',
    },
    title: {
      color: 'var(--green-700)',
      fontSize: '14px',
      margin: '0 0 8px',
      fontWeight: 600,
    },
    text: {
      fontSize: '13px',
      color: 'var(--charcoal-60)',
      margin: 0,
      lineHeight: 1.6,
    },
  };

  const messageStyles = {
    success: {
      background: '#E8F5E9',
      border: '1px solid #C8E6C9',
      borderRadius: 'var(--radius-m)',
      padding: '16px',
      marginBottom: '20px',
      color: '#2E7D32',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    error: {
      background: '#FFEBEE',
      border: '1px solid #FFCDD2',
      borderRadius: 'var(--radius-m)',
      padding: '16px',
      marginBottom: '20px',
      color: '#C62828',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
  };

  return (
    <LayoutWrapper>
      <Section title="Contact Us">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px', 
            maxWidth: '1000px', 
            margin: '0 auto' 
          }}
          data-contact-grid
        >
          {/* Contact Info - Desktop Left */}
          <div data-contact-info>
            <h3 style={{ color: 'var(--green-900)', marginTop: 0, fontSize: '18px', marginBottom: '24px' }}>
              Get In Touch
            </h3>

            <div style={contactInfoStyles.section}>
              <h4 style={contactInfoStyles.title}>📍 Address</h4>
              <p style={contactInfoStyles.text}>
                123 Herbal Lane<br />
                Colombo 03<br />
                Sri Lanka
              </p>
            </div>

            <div style={contactInfoStyles.section}>
              <h4 style={contactInfoStyles.title}>📞 Phone</h4>
              <p style={contactInfoStyles.text}>
                +94 77 000 0000
              </p>
            </div>

            <div style={contactInfoStyles.section}>
              <h4 style={contactInfoStyles.title}>📧 Email</h4>
              <p style={contactInfoStyles.text}>
                hello@ayurcare.lk
              </p>
            </div>
          </div>

          {/* Contact Form - Desktop Right */}
          <form onSubmit={handleSubmit} data-contact-form>
            {submitMessage.text && (
              <div style={messageStyles[submitMessage.type]}>
                <span>{submitMessage.type === 'success' ? '✓' : '✕'}</span>
                <span>{submitMessage.text}</span>
              </div>
            )}

            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
            <FormField
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 7X XXX XXXX"
              disabled={isSubmitting}
            />
            <FormField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
              disabled={isSubmitting}
            />
            <FormField
              label="Message"
              type="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              required
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              variant="primary" 
              block
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            [data-contact-grid] {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
              grid-template-areas: "form" "info" !important;
            }
            [data-contact-form] {
              grid-area: form !important;
            }
            [data-contact-info] {
              grid-area: info !important;
            }
          }
          @media (max-width: 768px) {
            [data-contact-grid] {
              gap: 24px !important;
            }
            [data-contact-info] {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 20px !important;
            }
            [data-contact-info] > h3 {
              grid-column: 1 / -1 !important;
              font-size: 16px !important;
              margin-bottom: 8px !important;
            }
          }
          @media (max-width: 480px) {
            [data-contact-grid] {
              gap: 20px !important;
            }
            [data-contact-info] {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            [data-contact-info] h3 {
              font-size: 14px !important;
              margin-bottom: 12px !important;
            }
            [data-contact-info] h4 {
              font-size: 13px !important;
              margin: 0 0 6px !important;
            }
            [data-contact-info] p {
              font-size: 12px !important;
              margin-bottom: 0 !important;
            }
          }
        `}</style>
      </Section>
    </LayoutWrapper>
  );
}
