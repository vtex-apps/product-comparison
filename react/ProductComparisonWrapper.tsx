import React, { ReactChildren, ReactChild } from 'react'

import ComparisonContext from './ProductComparisonContext'

interface Props {
  children: ReactChildren | ReactChild
}
const ProductComparisonWrapper = ({ children }: Props) => {
  const { ProductComparisonProvider } = ComparisonContext

  return <ProductComparisonProvider>{children}</ProductComparisonProvider>
}

export default ProductComparisonWrapper
