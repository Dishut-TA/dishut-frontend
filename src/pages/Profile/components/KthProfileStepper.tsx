import React from 'react';
import { KTH_STEPPER_STEPS } from '../types';

interface KthProfileStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const KthProfileStepper: React.FC<KthProfileStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-md mx-auto my-6 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Lines Behind Circles */}
        <div className="absolute top-3.5 left-6 right-6 -translate-y-1/2 flex items-center z-0">
          {/* Line 1 -> 2 */}
          <div
            className={`h-0.5 flex-1 transition-colors duration-300 ${
              currentStep >= 2 ? 'bg-[#185325]' : 'bg-gray-300'
            }`}
          />
          {/* Line 2 -> 3 */}
          <div
            className={`h-0.5 flex-1 transition-colors duration-300 ${
              currentStep >= 3 ? 'bg-[#185325]' : 'bg-gray-300'
            }`}
          />
        </div>

        {/* Step Items */}
        {KTH_STEPPER_STEPS.map((step) => {
          const isCompletedOrActive = step.number <= currentStep;
          const isClickable = onStepClick && step.number < currentStep;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && onStepClick(step.number)}
              className={`relative z-10 flex flex-col items-center flex-1 ${
                isClickable ? 'cursor-pointer' : ''
              }`}
            >
              {/* Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300 shadow-sm ${
                  isCompletedOrActive ? 'bg-[#185325]' : 'bg-[#8E9093]'
                }`}
              >
                {step.number}
              </div>

              {/* Label */}
              <div className="mt-2 text-center min-h-7.5 flex flex-col justify-start">
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors duration-200 ${
                    isCompletedOrActive ? 'text-[#185325]' : 'text-gray-400'
                  }`}
                >
                  {step.line1}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors duration-200 ${
                    isCompletedOrActive ? 'text-[#185325]' : 'text-gray-400'
                  }`}
                >
                  {step.line2}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KthProfileStepper;
