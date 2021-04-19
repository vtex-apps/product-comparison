declare module 'vtex.list-context*' {
  import type { Context, Provider } from 'react'

  export const useListContext: Context
  export const ListContextProvider: Provider
}
