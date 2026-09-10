import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | PostNest.in - Publish Like a Pro',
  description: 'Get in touch with the PostNest editorial, technical, and partnership teams. We respond within 24 business hours.',
  openGraph: {
    title: 'Contact PostNest.in - Publish Like a Pro',
    description: 'Get in touch with the PostNest editorial, technical, and partnership teams.',
    url: 'https://postnest.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
