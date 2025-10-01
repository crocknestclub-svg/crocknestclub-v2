'use client';
import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { CheckoutStepper } from './CheckoutStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestPayment } from '@/src/actions/payment';

const steps = ['Cart', 'Address', 'Payment', 'Confirmation'];

export const CheckoutForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { items } = useCartStore();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle'|'success'|'error'>('idle');

  // Instamojo payment handler
  const handlePayment = async () => {
    setPaymentStatus('idle');
    try {
      // Create order first
      const productIds = items.map((i) => i.id);
      const orderRes = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds }) });
      const { order } = await orderRes.json();
      const webhookUrl = window.location.origin + '/api/instamojo-webhook';
      const payment = await requestPayment({
        purpose: 'Order Payment',
        amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0).toString(),
        buyer_name: address,
        email: email,
        phone: '',
        redirect_url: `${window.location.origin}/order-confirmation?orderId=${encodeURIComponent(order.id)}`,
        webhook: webhookUrl,
        custom_order_id: order.id,
      });
      // Note: custom_order_id added at lib level; SDK may embed via purpose or webhook metadata depending on provider support
      window.location.href = payment.payment_request.longurl;
    } catch {
      setPaymentStatus('error');
    }
  };

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    try {
      if (value.length < 3) {
        setAddressSuggestions([]);
        return;
      }
      const res = await fetch(`/api/checkout/address-autocomplete?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setAddressSuggestions(data.suggestions || []);
    } catch {
      setAddressSuggestions([]);
    }
  };

  const useFallback = async () => {
    try {
      const productIds = items.map((i) => i.id);
      const orderRes = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds }) });
      const { order } = await orderRes.json();
      const res = await fetch('/api/checkout/fallback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id }) });
      const data = await res.json();
      if (data.ok) {
        window.location.href = `/order-confirmation?orderId=${encodeURIComponent(order.id)}`;
      }
    } catch {}
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
          <Input placeholder="Enter address" value={address} onChange={e => handleAddressChange(e.target.value)} />
          {addressSuggestions.length > 0 && (
            <ul className="mt-2 border rounded">
              {addressSuggestions.map(s => (
                <li key={s} className="px-2 py-1 cursor-pointer hover:bg-gray-50" onClick={() => { setAddress(s); setAddressSuggestions([]); }}>{s}</li>
              ))}
            </ul>
          )}
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2" />
          <Button onClick={() => setCurrentStep(2)} disabled={!address || !email} className="mt-4">Next</Button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Payment</h2>
          <Button onClick={handlePayment}>Pay with Instamojo</Button>
          <Button variant="outline" className="ml-2" onClick={useFallback}>Cash on Delivery</Button>
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
