'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { verifyFlouciPayment } from '@/lib/api';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre paiement en cours...');
  const router = useRouter();

  useEffect(() => {
    if (!paymentId) {
      setStatus('error');
      setMessage('Identifiant de paiement manquant.');
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyFlouciPayment(paymentId);
        if (res.verified) {
          setStatus('success');
          setMessage('Paiement confirmé ! Votre abonnement a été mis à jour.');
          // Refresh user data if possible or just wait for user to go back
        } else {
          setStatus('error');
          setMessage('Le paiement n\'a pas pu être vérifié. Veuillez contacter le support.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Une erreur est survenue lors de la vérification du paiement.');
      }
    };

    verify();
  }, [paymentId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-fade-in">
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
              <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600 w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Vérification...</h1>
            <p className="text-gray-500 font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-scale-in">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900">Succès !</h1>
              <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="pt-4">
              <Link 
                href="/admin/abonnement"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 group"
              >
                Retour à l'abonnement
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-shake">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle size={48} strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900">Oups !</h1>
              <p className="text-red-500/80 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
              >
                Réessayer la vérification
              </button>
              <Link 
                href="/admin/abonnement"
                className="text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
              >
                Retourner aux plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
