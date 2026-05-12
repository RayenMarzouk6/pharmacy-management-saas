'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pill, Check, Zap, Star, Shield, ArrowRight } from 'lucide-react';

export default function SubscriptionPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Essentiel',
      priceMonthly: 99,
      priceYearly: 990,
      description: 'Idéal pour les petites pharmacies indépendantes.',
      icon: <Pill className="w-6 h-6 text-primary-500" />,
      features: [
        'Gestion de stock basique',
        'Point de vente (POS)',
        'Jusqu\'à 2 pharmaciens',
        'Support par email'
      ],
      color: 'bg-white',
      border: 'border-border',
      popular: false
    },
    {
      name: 'Professionnel',
      priceMonthly: 199,
      priceYearly: 1990,
      description: 'Pour les pharmacies en croissance nécessitant plus d\'outils.',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      features: [
        'Tout du plan Essentiel',
        'Gestion avancée (lots, péremptions)',
        'Jusqu\'à 10 pharmaciens',
        'Rapports et analyses',
        'Support prioritaire 24/7'
      ],
      color: 'bg-primary-50',
      border: 'border-primary-500',
      popular: true
    },
    {
      name: 'Entreprise',
      priceMonthly: 399,
      priceYearly: 3990,
      description: 'Pour les grands réseaux et les cliniques.',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      features: [
        'Tout du plan Professionnel',
        'Multi-pharmacies',
        'Pharmaciens illimités',
        'API personnalisée',
        'Gestionnaire de compte dédié'
      ],
      color: 'bg-white',
      border: 'border-border',
      popular: false
    }
  ];

  const handleSelectPlan = (planName: string) => {
    // In a real app, you would pass the plan ID to the payment gateway or backend
    router.push(`/payment?plan=${planName}&cycle=${billingCycle}`);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
            Choisissez le plan idéal pour votre pharmacie
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Des tarifs transparents, sans frais cachés. Annulez à tout moment.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex items-center p-1 bg-gray-100 rounded-full border border-gray-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative w-1/2 rounded-full py-2 px-8 text-sm font-medium whitespace-nowrap transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-foreground shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative w-1/2 rounded-full py-2 px-8 text-sm font-medium whitespace-nowrap transition-all ${
                  billingCycle === 'yearly' ? 'bg-white text-foreground shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Annuel
                <span className="absolute -top-3 -right-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  -16%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto animate-slide-up">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`rounded-3xl p-8 border ${plan.border} ${plan.color} relative shadow-xl hover-lift glass`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star size={12} className="fill-white" /> Le plus populaire
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              </div>
              
              <p className="text-gray-500 mb-6 h-12">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline text-foreground">
                <span className="text-5xl font-extrabold tracking-tight">
                  {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                </span>
                <span className="text-xl font-semibold ml-1">TND</span>
                <span className="text-gray-500 ml-2">/{billingCycle === 'monthly' ? 'mois' : 'an'}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/30' 
                    : 'bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-200 hover:bg-gray-50'
                }`}
              >
                Choisir ce plan <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
