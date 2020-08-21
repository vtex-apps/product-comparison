import React, { MouseEvent } from 'react'
import { pathOr } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useCssHandles } from 'vtex.css-handles'
import { withToast } from 'vtex.styleguide'
import { IconClose } from 'vtex.store-icons'
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

  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext
  const dispatchComparison = useProductComparisonDispatch()
  const valuesFromContext = useProductSummary()
  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const productName = pathOr('', ['product', 'productName'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  const comparisonData = useProductComparisonState()
  const isDrawerCollapsed = pathOr(false, ['isDrawerCollapsed'], comparisonData)

  const showMessage = (message: string, show: boolean = true) => {
    if (showToast && show) {
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
      )} "${productName}" ${intl.formatMessage(messages.removed)}`,
      isDrawerCollapsed
    )
  }

  return (
    <div
      className={`${cssHandles.closeButtonContainer} flex justify-end items-start flex-grow-1`}
    >
      <button
        className={`${cssHandles.closeButton} bg-transparent button-reset t-small pointer b--none-ns outline-0`}
        onClick={removeProductFromCompare}
      >
        <IconClose orientation="right" size={12} type="line" />
      </button>
    </div>
  )
}

export default withToast(injectIntl(RemoveButton))
