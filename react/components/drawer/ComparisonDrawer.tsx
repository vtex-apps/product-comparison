import React from 'react'
import { pathOr, isEmpty } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'

import styles from './drawer.css'
import { Button } from 'vtex.styleguide'
import ProductThumbnail from './ProductThumbnail'

const ComparisonDrawer = () => {
  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const removeAllItems = () => {
    dispatchComparison({
      type: 'REMOVE_ALL',
    })
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div className={`${styles.drawerContainer} mw9 w-100 flex justify-center`}>
      <div className={`${styles.drawer} flex flex-row justify-center pl3 pr3`}>
        {comparisonProducts.map(thumbnail => {
          return (
            <ProductThumbnail
              key={`${thumbnail.productId}-${thumbnail.skuId}`}
              productToCompare={thumbnail}
            />
          )
        })}
        <div className={`${styles.comparisonButtons} flex flex-column ma3`}>
          <div className="">
            <Button
              block
              size="small"
              className={`${styles.compareProductsButton} ma3`}
              href="/product-comparison"
            >
              Compare
            </Button>
          </div>
          <div className="mt3">
            <Button
              block
              variation="danger-tertiary"
              size="small"
              onClick={removeAllItems}
            >
              Remove All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonDrawer
