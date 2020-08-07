import React from 'react'
// import { pathOr, isEmpty, find, propEq } from 'ramda'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
// import ComparisonSummary from './ComparisonSummary'
import styles from './comparisonList.css'

// import ComparisonProductContext from '../../ComparisonProductContext'

// interface Props {
//   maxItemCount: number
// }

const ComparisonList = () => {
  const { useProductComparisonState } = ComparisonContext
  // const { useComparisonProductState } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  // const productData = useComparisonProductState()
  // const products = pathOr([] as ProductToCompare[], ['products'], productData)

  // const comparisonListStyles = {
  //   columnWidth: { width: `${maxItemCount > 5 ? 100 / maxItemCount : 15}%` },
  // }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div className="mw9 w-100 center">
      <div className={`${styles.productSummaryRow} flex flex-row mt6 pa3`}>
        <div
          className={`${styles.comparisonNameCol} w-20 flex items-center ma1 pa3`}
        >
          <span>Products</span>
        </div>
        <ExtensionPoint id="list-context.comparison-list" />
      </div>
      <div className={`${styles.productComparisonGrid}`}>
        <ExtensionPoint id="product-comparison-block" />
      </div>
    </div>
  )
}

export default ComparisonList
