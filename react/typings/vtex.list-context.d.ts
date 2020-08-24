declare module 'vtex.list-context*' {
  import { Context, Provider } from 'react'

  export const useListContext: Context
  export const ListContextProvider: Provider
}
