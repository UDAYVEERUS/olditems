interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'No products found',
  message = 'Try adjusting your search or filters',
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-600 mb-2">{title}</p>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}