/* eslint-disable @typescript-eslint/no-explicit-any */
interface ToastInput {
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ProductToCompare {
  productId: string
  skuId: string
  categoryId?: string
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

interface GroupedComparisonFields {
  [key: string]: ComparisonField[]
}

interface ComparisonField {
  fieldType: string
  groupName?: string
  name: string
  displayValue: string
  showOnSite: boolean
}

interface ProductSpecificationGroup {
  name: string
  originalName: string
  specifications: ProductSpecification[]
}

interface ProductSpecification {
  name: string
  values: string[]
  groupName?: string
}

interface Variation {
  name: string
  values: string[]
}

interface SpecificationGroupValues {
  [key: string]: ProductSpecification[]
}
