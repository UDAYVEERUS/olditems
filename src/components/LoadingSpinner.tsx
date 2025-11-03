import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({
  size = 48,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center min-h-[60vh] ${className}`}>
      <Loader2 className="animate-spin text-[#E06B2D]" size={size} />
    </div>
  );
}