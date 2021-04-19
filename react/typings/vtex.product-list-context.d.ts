declare module 'vtex.product-list-context*' {
  import type { Context, Provider } from 'react'

  export const ProductListContext: Context
  export const useProductImpression: Provider
}
