declare module 'vtex.store-icons' {
  import type { ComponentType } from 'react'

  interface Props {
    size: number
    viewBox?: string
    orientation?: string
    type?: string
  }

  export const IconClose: ComponentType<Props>
}
