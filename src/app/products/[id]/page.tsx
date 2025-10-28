import ProductDetailClient from './ProductDetailClient';

// Extract product ID from slug
function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart.startsWith('prod_')) {
    return lastPart;
  }
  
  return slug;
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const productId = extractIdFromSlug(id);

  return <ProductDetailClient productId={productId} />;
}