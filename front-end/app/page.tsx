import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import MultiTenant from '@/components/landing/MultiTenant';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import LiveNotification from '@/components/landing/LiveNotification';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <MultiTenant />
        <Pricing />
        <Testimonials />
        
        {/* Call To Action Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-blue-900 opacity-90"></div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Prêt à moderniser votre pharmacie ?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Rejoignez les pharmacies les plus performantes de Tunisie. Essayez PharmaSaaS aujourd&apos;hui, sans engagement.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all shadow-xl shadow-primary-900/50"
            >
              Créer mon compte gratuitement
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <LiveNotification />
    </div>
  );
}
