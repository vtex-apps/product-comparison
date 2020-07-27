/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProductToCompare {
  productId: string
  skuId: string
}
interface Sku {
  itemId: string
  [key: string]: any | unknown
}

interface Product {
  productId: string
  [key: string]: any | unknown
}

interface ComparisonItem {
  imageUrl: string
  product: Product
  selectedSku: Sku
}

interface ComparisonThumbnail {
  productName: string
  skuName: string
  imageUrl: string
}
