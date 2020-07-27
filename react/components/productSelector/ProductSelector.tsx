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
  }, [comparisonData.products, itemId, productId, valuesFromContext])

  const productSelectorOnChange = (e: any | unknown) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

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

  return (
    <div className="mb3">
      <Checkbox
        checked={isChecked}
        id={`${productId}-${itemId}-product-comparison`}
        label="Add to Compare"
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorOnChange}
      />
    </div>
  )
}

export default ProductSelector
