import React, { ReactChildren, ReactChild } from 'react'
import ComparisonContext from './ProductComparisonContext'
import ComparisonProductWrapper from './ComparisonProductWrapper'
import { ToastProvider } from 'vtex.styleguide'

interface Props {
  children: ReactChildren | ReactChild
  maxNumberOfItemsToCompare: number | undefined
}
const ProductComparisonWrapper = ({maxNumberOfItemsToCompare, children }: Props) => {
  const { ProductComparisonProvider } = ComparisonContext

  return (
    <ProductComparisonProvider maxNumberOfItemsToCompare={maxNumberOfItemsToCompare}>
      <ComparisonProductWrapper>
        <ToastProvider positioning="window">{children}</ToastProvider>
      </ComparisonProductWrapper>
    </ProductComparisonProvider>
  )
}


ProductComparisonWrapper.schema = {
  title: 'admin/editor.product-comparison-wrapper.title',
  description: 'admin/editor.product-comparison-wrapper.description',
  type: 'object',
  properties: {
    maxNumberOfItemsToCompare: {
      title: 'admin/editor.product-comparison-wrapper.maxItemsToCompare',
      type: 'number',
    }
  },
}

export default ProductComparisonWrapper
