declare module 'vtex.store-resources/Queries' {
  import type { DocumentNode } from 'graphql'

  export const orderForm: DocumentNode
}

declare module 'vtex.store-resources/QueryProduct' {
  import type { DocumentNode } from 'graphql'

  const document: DocumentNode
  export = document
}
