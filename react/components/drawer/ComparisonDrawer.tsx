import React, { useState } from 'react'
import { pathOr, isEmpty } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import styles from './drawer.css'
import { Button, Collapsible } from 'vtex.styleguide'
import { ExtensionPoint } from 'vtex.render-runtime'

const ComparisonDrawer = () => {
  const [isCollapsed, setCollapsed] = useState(false)
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
    <div className={`${styles.drawerContainer} mw9  w-100 flex justify-center`}>
      <Collapsible
        header={
          <div className={`${styles.comparisonButtons} flex flex-row ma3`}>
            <div>
              <span className="c-action-primary hover-c-action-primary fw5">
                <span>Compare </span> <span>{comparisonProducts.length}</span>
                <span> Products</span>
              </span>
            </div>
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
            <div className="">
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
        }
        onClick={(e: { target: { isOpen: boolean } }) =>
          setCollapsed(e.target.isOpen)
        }
        isOpen={isCollapsed}
      >
        <div
          className={`${styles.drawer} flex flex-row justify-center pl3 pr3`}
        >
          {/* <DrawerShelf /> */}
          {/* {comparisonProducts.map(thumbnail => {
            return (
              // <ProductThumbnail
              //   key={`${thumbnail.productId}-${thumbnail.skuId}`}
              //   productToCompare={thumbnail}
              // />
              
            )
          })} */}
          <ExtensionPoint id="list-context.comparison-list" />
        </div>
      </Collapsible>
    </div>
  )
}

export default ComparisonDrawer
