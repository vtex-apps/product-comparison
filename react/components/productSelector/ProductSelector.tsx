import React, { useState, useEffect } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Button } from 'vtex.styleguide'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import styles from './productSelector.css'

const ProductSelector = () => {
  const [isAdded, setIsAdded] = useState(false)
  const valuesFromContext = useProductSummary()
  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  useEffect(() => {
    const selectedProducts =
      productId && itemId
        ? find(
            allPass([propEq('productId', productId), propEq('skuId', itemId)])
          )(comparisonData.products)
        : []
    setIsAdded(selectedProducts && !isEmpty(selectedProducts))
  }, [comparisonData.products, itemId, productId])

  const productSelectorOnClick = (e: any | unknown) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdded) {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'REMOVE',
      })
    } else {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'ADD',
      })
    }
  }

  return (
    <div className={`${styles.compareButtonWrapper} mb3`}>
      <Button
        variation="tertiary"
        id={`${productId}-${itemId}-product-comparison`}
        name={`${productId}-${itemId}-product-comparison`}
        onClick={productSelectorOnClick}
      >
        <span
          className={`${
            isAdded ? styles.compareSelectedIcon : styles.compareRemovedIcon
          } ${styles.iconSize}`}
        ></span>
        <span className={styles.compareButtonText}>
          {isAdded ? 'Remove from Compare' : 'Add to Compare'}
        </span>
      </Button>
    </div>
  )
}

export default ProductSelector
