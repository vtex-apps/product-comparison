import React from 'react'
import { pathOr } from 'ramda'
import { withCssHandles } from 'vtex.css-handles'
import ComparisonContext from '../../ProductComparisonContext'
import './removeButton.css'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'

const CSS_HANDLES = ['closeButton', 'closeButtonContainer']

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cssHandles?: any
}

const RemoveButton = ({ cssHandles }: Props) => {
  const { useProductComparisonDispatch } = ComparisonContext

  const dispatchComparison = useProductComparisonDispatch()

  const valuesFromContext = useProductSummary()
  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  const removeProductFromCompare = (e: any) => {
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

export default withCssHandles(CSS_HANDLES)(RemoveButton)
