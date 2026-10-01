import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Cargando información...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2 className="w-10 h-10 text-verde-oscuro animate-spin mb-4" />
      <p className="text-texto-secundario text-sm font-medium">{message}</p>
    </div>
  );
};
