"use client";

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess: _onSuccess }: SignUpFormProps) {
  return (
    <div className="text-sm text-neutral-500 text-center py-4">
      Sign up is not available. Contact the administrator for access.
    </div>
  );
}