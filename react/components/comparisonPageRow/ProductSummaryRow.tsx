import React from 'react'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
import styles from './comparisonList.css'

const ProductSummaryRow = () => {
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div className={`${styles.productSummaryRow} flex flex-row mt6 pa3`}>
      <div
        className={`${styles.comparisonNameCol} w-20 flex items-center ma1 pa3`}
      >
        <span>Products</span>
      </div>
      <ExtensionPoint id="list-context.comparison-product-summary-slider" />
    </div>
  )
}

export default ProductSummaryRow
