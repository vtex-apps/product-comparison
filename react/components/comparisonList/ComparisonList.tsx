import React from 'react'
import { pathOr, isEmpty } from 'ramda'

import ComparisonContext from '../../ProductComparisonContext'
import ComparisonSummary from './ComparisonSummary'

const ComparisonList = () => {
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
    <div className="mw9 w-100 center flex flex-row mt6 pa3">
      {comparisonProducts.map(product => {
        // eslint-disable-next-line react/jsx-key
        return <ComparisonSummary productToCompare={product} />
      })}
    </div>
  )
}

export default ComparisonList
