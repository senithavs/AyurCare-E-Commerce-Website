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

  return (
    <LayoutWrapper>
      <Section title="Contact Us">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Contact Info */}
          <div>
            <h3 style={{ color: 'var(--green-900)', marginTop: 0 }}>Get In Touch</h3>
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--green-700)', fontSize: '14px', margin: '0 0 8px' }}>Address</h4>
              <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>
                123 Herbal Lane<br />
                Colombo 03<br />
                Sri Lanka
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--green-700)', fontSize: '14px', margin: '0 0 8px' }}>Phone</h4>
              <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>
                +94 77 000 0000
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--green-700)', fontSize: '14px', margin: '0 0 8px' }}>Email</h4>
              <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>
                hello@ayurcare.lk
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--green-700)', fontSize: '14px', margin: '0 0 8px' }}>Business Hours</h4>
              <p style={{ fontSize: '13px', color: 'var(--charcoal-60)', margin: 0 }}>
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
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
      </Section>
    </LayoutWrapper>
  );
}
