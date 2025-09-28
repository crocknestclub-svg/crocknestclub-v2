'use client';
import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { CheckoutStepper } from './CheckoutStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPayment } from '../../lib/instamojo';

const steps = ['Cart', 'Address', 'Payment', 'Confirmation'];

export const CheckoutForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { items } = useCartStore();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle'|'success'|'error'>('idle');

  // Instamojo payment handler
  const handlePayment = async () => {
    setPaymentStatus('idle');
    try {
      const payment = await createPayment({
        purpose: 'Order Payment',
        amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0).toString(),
        buyer_name: address,
        email,
        phone: '', // Add phone field if available
        redirect_url: window.location.origin + '/order-confirmation',
      });
      window.location.href = payment.payment_request.longurl;
    } catch {
      setPaymentStatus('error');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <CheckoutStepper steps={steps} currentStep={currentStep} />
      {currentStep === 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Your Cart</h2>
          {items.length === 0 ? <p>Cart is empty.</p> : (
            <ul className="mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between py-2 border-b">
                  <span>{item.name}</span>
                  <span>{item.quantity} x ₹{item.price}</span>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={() => setCurrentStep(1)} disabled={items.length === 0}>Next</Button>
        </div>
      )}
      {currentStep === 1 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Shipping Address</h2>
          <Input placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2" />
          <Button onClick={() => setCurrentStep(2)} disabled={!address || !email} className="mt-4">Next</Button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Payment</h2>
          <Button onClick={handlePayment}>Pay with Instamojo</Button>
          {paymentStatus === 'success' && <p className="text-green-600 mt-2">Payment successful!</p>}
          {paymentStatus === 'error' && <p className="text-red-600 mt-2">Payment failed. Try again.</p>}
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Order Confirmation</h2>
          <p>Thank you for your order! A confirmation email will be sent to {email}.</p>
        </div>
      )}
    </div>
  );
};
