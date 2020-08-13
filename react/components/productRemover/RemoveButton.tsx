import React, { MouseEvent } from 'react'
import { pathOr } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useCssHandles } from 'vtex.css-handles'
import './remove.css'

const CSS_HANDLES = ['closeButton', 'closeButtonContainer']

const RemoveButton = () => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { useProductComparisonDispatch } = ComparisonContext
  const dispatchComparison = useProductComparisonDispatch()
  const valuesFromContext = useProductSummary()
  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  const removeProductFromCompare = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dispatchComparison({
      args: {
        product: {
          productId: productId,
          skuId: itemId,
        },
      },
      type: 'REMOVE',
    })
  }

  return (
    <div className={`${cssHandles.closeButtonContainer} flex justify-end`}>
      <button
        className={`${cssHandles.closeButton} bg-transparent button-reset t-small pointer b--none-ns outline-0`}
        onClick={removeProductFromCompare}
      >
        x
      </button>
    </div>
  )
}

export default RemoveButton
