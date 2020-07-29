declare module 'vtex.store-resources/Queries' {
  import { DocumentNode } from 'graphql'

  export const orderForm: DocumentNode
}

declare module 'vtex.store-resources/QueryProduct' {
  import { DocumentNode } from 'graphql'

  const document: DocumentNode
  export = document
}
