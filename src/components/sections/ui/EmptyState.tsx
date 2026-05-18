interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="text-gray-700 font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-400 text-sm max-w-sm">{message}</p>
    </div>
  );
}