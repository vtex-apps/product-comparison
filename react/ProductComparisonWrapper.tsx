import React, { ReactChildren, ReactChild } from 'react'
import ComparisonContext from './ProductComparisonContext'
import ComparisonProductWrapper from './ComparisonProductWrapper'
import { ToastProvider } from 'vtex.styleguide'

interface Props {
  children: ReactChildren | ReactChild
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
