'use client';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  className?: string;
}

export default function ProgressHeader({
  currentStep,
  totalSteps,
  title,
  subtitle,
  className = ''
}: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`text-center mb-8 ${className}`}>
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-600 mb-6">
        {subtitle}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index < currentStep
                ? 'bg-blue-600'
                : index === currentStep
                ? 'bg-blue-400'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
