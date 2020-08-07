/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Checkbox: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>
  export const Collapsible: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
