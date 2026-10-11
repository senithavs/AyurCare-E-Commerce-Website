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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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

            <div style={contactInfoStyles.section}>
              <h4 style={contactInfoStyles.title}>🕐 Business Hours</h4>
              <p style={contactInfoStyles.text}>
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form - Desktop Right */}
          <form onSubmit={handleSubmit} data-contact-form>
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            <FormField
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 7X XXX XXXX"
            />
            <FormField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
            <FormField
              label="Message"
              type="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              required
            />
            <Button type="submit" variant="primary" block>
              Send Message
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
