import React, { useState } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useResponsiveValue } from 'vtex.responsive-values'

import ComparisonContext from '../../ProductComparisonContext'
import ComparisonSummary from './ComparisonSummary'
import styles from './comparisonList.css'
import ComparisonProductContext from './ComparisonProductContext'

interface Props {
  maxItemCount: number
}

const ComparisonList: StorefrontFunctionComponent<
  Props & SliderLayoutProps & SliderLayoutSiteEditorProps
> = ({ maxItemCount = 4, children, ...contextProps }) => {
  const [products] = useState([] as Product[])

  const { useProductComparisonState } = ComparisonContext
  const { ComparisonProductProvider } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const responsiveArrowIconSize = useResponsiveValue(25)
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const comparisonListStyles = {
    columnWidth: { width: `${maxItemCount > 5 ? 100 / maxItemCount : 15}%` },
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <ComparisonProductProvider products={products}>
      <div className="mw9 w-100 center">
        <div className={`${styles.productSummaryRow} flex flex-row mt6 pa3`}>
          <div
            className={`${styles.comparisonNameCol} flex items-center ma1 pa3`}
            style={comparisonListStyles.columnWidth}
          >
            <span>Products</span>
          </div>
          {comparisonProducts.map(product => {
            return (
              <ComparisonSummary
                key={`product-summary-${product.skuId}`}
                productToCompare={product}
                product={find(propEq('productId', product.productId))(products)}
                columnStyles={comparisonListStyles.columnWidth}
              />
            )
          })}
        </div>
        <div className={`${styles.productComparisonGrid}`}>
          <ExtensionPoint
            id="product-comparison-block"
            maxItemCount={maxItemCount}
            columnStyles={comparisonListStyles.columnWidth}
          />
        </div>
      </div>
    </ComparisonProductProvider>
  )
}

export default ComparisonList
