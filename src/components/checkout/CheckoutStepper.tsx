import React from 'react';

interface StepProps {
  steps: string[];
  currentStep: number;
}

export const CheckoutStepper: React.FC<StepProps> = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between w-full mb-6">
    {steps.map((step, idx) => (
      <div key={step} className="flex-1 flex flex-col items-center">
        <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-bold ${idx <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
        <span className={`mt-2 text-xs ${idx <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
        {idx < steps.length - 1 && <div className="w-full h-1 bg-gray-200 mt-2" />}
      </div>
    ))}
  </div>
);
