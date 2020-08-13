/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, MouseEvent } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Checkbox } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'

const CSS_HANDLES = ['productSelectorContainer']

const ProductSelector = () => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const [isChecked, setIsChecked] = useState(false)
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
    setIsChecked(selectedProducts && !isEmpty(selectedProducts))
  }, [comparisonData.products, itemId, productId])

  const productSelectorChanged = (e: { target: { checked: boolean } }) => {
    if (e.target.checked) {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'ADD',
      })
    } else {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'REMOVE',
      })
    }
  }

  const productSelectionOnClicked = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={productSelectionOnClicked}
      className={`${cssHandles.productSelectorContainer} mb3`}
    >
      <Checkbox
        checked={isChecked}
        id={`${productId}-${itemId}-product-comparison`}
        label="Compare"
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorChanged}
        value={isChecked}
      />
    </div>
  )
}

export default ProductSelector
