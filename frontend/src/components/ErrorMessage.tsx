import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-coral-light border border-coral text-texto-principal rounded-2xl p-6 text-center max-w-lg mx-auto my-8 shadow-sm">
      <AlertTriangle className="w-10 h-10 text-coral mx-auto mb-3" />
      <h3 className="text-texto-principal font-extrabold text-base mb-1">Ocurrió un problema</h3>
      <p className="text-texto-secundario text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-bold transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  );
};
