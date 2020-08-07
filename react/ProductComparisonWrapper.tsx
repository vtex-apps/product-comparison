import React, { ReactChildren, ReactChild } from 'react'
import ComparisonContext from './ProductComparisonContext'
import ComparisonProductWrapper from './ComparisonProductWrapper'

interface Props {
  children: ReactChildren | ReactChild
}
const ProductComparisonWrapper = ({ children }: Props) => {
  const { ProductComparisonProvider } = ComparisonContext

  return (
    <ProductComparisonProvider>
      <ComparisonProductWrapper>{children}</ComparisonProductWrapper>
    </ProductComparisonProvider>
  )
}

export default ProductComparisonWrapper
