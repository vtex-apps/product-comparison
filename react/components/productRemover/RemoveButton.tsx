import React, { MouseEvent } from 'react'
import { pathOr } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useCssHandles } from 'vtex.css-handles'
import { withToast } from 'vtex.styleguide'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import './remove.css'

const CSS_HANDLES = ['closeButton', 'closeButtonContainer']

const messages = defineMessages({
  product: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product',
  },
  removed: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product-removed',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}

const RemoveButton = ({ showToast, intl }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { useProductComparisonDispatch } = ComparisonContext
  const dispatchComparison = useProductComparisonDispatch()
  const valuesFromContext = useProductSummary()
  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const productName = pathOr('', ['product', 'productName'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  const showMessage = (message: string) => {
    if (showToast) {
      showToast({
        message: message,
      })
    }
  }

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
    showMessage(
      `${intl.formatMessage(
        messages.product
      )} "${productName}" ${intl.formatMessage(messages.removed)}`
    )
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

export default withToast(injectIntl(RemoveButton))
