import type { ReactChildren, ReactChild } from 'react'
import React from 'react'
import { ToastProvider } from 'vtex.styleguide'

import ComparisonContext from './ProductComparisonContext'
import ComparisonProductWrapper from './ComparisonProductWrapper'

interface Props {
  children: ReactChildren | ReactChild
  maxNumberOfItemsToCompare: number | undefined
}
const ProductComparisonWrapper = ({ children }: Props) => {
  const { ProductComparisonProvider } = ComparisonContext

  return (
    <ProductComparisonProvider>
      <ComparisonProductWrapper>
        <ToastProvider positioning="window">{children}</ToastProvider>
      </ComparisonProductWrapper>
    </ProductComparisonProvider>
  )
}

export default ProductComparisonWrapper
