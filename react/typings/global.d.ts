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
  productId: string
  skuId: string
  productName: string
  skuName: string
  imageUrl: string
}

interface CommercialOffer {
  [key: string]: any | unknown
}

interface SkuImage {
  imageUrl: string
  imageTag: string
}

interface Styles {
  [key: string]: any | unknown
}

interface ComparisonField {
  fieldType: string
  name: string
  displayValue: string
  showOnSite: boolean
}
