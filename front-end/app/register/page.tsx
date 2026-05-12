'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pill, User, Mail, Lock, Building2, MapPin, Phone, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, BadgeInfo } from 'lucide-react';
import { setAuthToken, register } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 Data
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await register({
        firstName,
        lastName,
        email,
        password,
        pharmacyName,
        pharmacyAddress,
        phoneNumber
      });
      
      if (data.token) {
        setAuthToken(data.token);
        
        // Redirect using dashboardPath from backend or default to /admin
        const path = data.dashboardPath || '/admin/dashboard';
        window.location.href = path;
      } else {
        setError(data.message || "Une erreur s'est produite lors de la création du compte.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-xl animate-fade-in relative z-10 my-8">
        <div className="glass rounded-3xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Pill size={32} />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Rejoignez PharmaSaaS</h1>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Gérez votre pharmacie plus efficacement. Créez votre compte en quelques étapes simples.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full transition-all duration-300 -z-10"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            <div className="flex justify-between w-full max-w-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>3</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 animate-slide-up">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-5 animate-slide-up">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-foreground">1. Détails du compte</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="Jean"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Adresse Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                    placeholder="contact@pharmacie.com"
                    required
                  />
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Confirmer mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                  Déjà un compte ? Se connecter
                </Link>
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                >
                  Suivant <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Pharmacy Details */}
          {step === 2 && (
            <form onSubmit={nextStep} className="space-y-5 animate-slide-up">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-foreground">2. Informations de la pharmacie</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nom de la pharmacie</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building2 size={18} />
                  </div>
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                    placeholder="Pharmacie Centrale"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Adresse complète</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={pharmacyAddress}
                    onChange={(e) => setPharmacyAddress(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                    placeholder="123 Avenue Habib Bourguiba, Tunis"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Numéro de téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                    placeholder="+216 71 123 456"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  <ArrowLeft size={16} /> Retour
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                >
                  Suivant <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Confirmation & Trial */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Presque terminé !</h2>
                <p className="text-gray-500">
                  Votre compte pour <strong>{pharmacyName || 'votre pharmacie'}</strong> est prêt à être créé.
                </p>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <BadgeInfo className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-1">Essai gratuit de 14 jours</h3>
                    <p className="text-sm text-primary-700">
                      Vous allez bénéficier de toutes les fonctionnalités premium de PharmaSaaS pendant 14 jours, sans engagement. À la fin de cette période, vous pourrez choisir un abonnement qui correspond à vos besoins.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  <ArrowLeft size={16} /> Retour
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Démarrer mon essai gratuit'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
