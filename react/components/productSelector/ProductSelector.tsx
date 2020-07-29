/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Checkbox } from 'vtex.styleguide'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'

const ProductSelector = () => {
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

  const productSelectorOnClick = (e: any | unknown) => {
    e.preventDefault()
    e.stopPropagation()

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

  const productComparisonClicked = (e: any | unknown) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onClick={productComparisonClicked} className=" mb3">
      <Checkbox
        checked={isChecked}
        id={`${productId}-${itemId}-product-comparison`}
        label="Compare"
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorOnClick}
        value={isChecked}
      />
    </div>
  )
}

export default ProductSelector
