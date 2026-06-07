'use client';

interface AuthErrorAlertProps {
  message: string;
}

export default function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md animate-fade-in">
      {message}
    </div>
  );
}
