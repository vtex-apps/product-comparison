import type { MouseEvent } from 'react'
import React from 'react'
import { pathOr } from 'ramda'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useCssHandles } from 'vtex.css-handles'
import { withToast } from 'vtex.styleguide'
import { IconClose } from 'vtex.store-icons'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

import ComparisonContext from '../../ProductComparisonContext'
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

  const { useProductComparisonState, useProductComparisonDispatch } =
    ComparisonContext

  const { push }: any = usePixel()
  const dispatchComparison = useProductComparisonDispatch()
  const valuesFromContext = useProductSummary()
  const productId = pathOr('', ['product', 'productId'], valuesFromContext)
  const productName = pathOr('', ['product', 'productName'], valuesFromContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)

  const comparisonData = useProductComparisonState()
  const isDrawerCollapsed = pathOr(false, ['isDrawerCollapsed'], comparisonData)

  const showMessage = (message: string, show = true) => {
    if (showToast && show) {
      showToast({
        message,
      })
    }
  }

  const removeProductFromCompare = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dispatchComparison({
      args: {
        product: {
          productId,
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
    push({
      event: 'compareProducts',
      products: [valuesFromContext.product],
      action: 'remove',
    })
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
