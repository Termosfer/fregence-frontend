import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Props {
  totalAmount: number;
  onPaymentSuccess: (paymentId: string) => void;
  customerName: string;
}

const StripePaymentForm = ({ totalAmount, onPaymentSuccess, customerName }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // 1. Backend-dən Secret Key alırıq
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-payment-intent?amount=${totalAmount}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
        }
      });
      const { clientSecret } = await response.json();

      // 2. Stripe ilə kartı yoxlayırıq
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name: customerName }
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Ödəniş uğurludur! Backend-ə göndərmək üçün ID-ni qaytarırıq
          onPaymentSuccess(result.paymentIntent.id);
        }
      }
    } catch {
      toast.error("Payment server error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FiLock className="text-teal-600" /> Secure Card Payment
      </h3>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#1a1a1a', '::placeholder': { color: '#aab7c4' } },
            invalid: { color: '#ef4444' },
          },
        }} />
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing || !stripe}
        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-[2px] hover:bg-gray-800 transition-all disabled:bg-gray-300 cursor-pointer"
      >
        {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)} Now`}
      </button>
    </div>
  );
};

export default StripePaymentForm;