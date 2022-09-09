/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MouseEvent } from 'react'
import React, { useState, useEffect } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Checkbox, withToast } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { usePixel } from 'vtex.pixel-manager'

import ComparisonContext from '../../ProductComparisonContext'

const CSS_HANDLES = ['productSelectorContainer']

const messages = defineMessages({
  product: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product',
  },
  added: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product-added',
  },
  removed: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.product-removed',
  },
  compare: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.compare',
  },
  comparisonUpperLimit: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.upper-limit-exceeded',
  },
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}
const getContextValue = (
  productContext: unknown,
  productSummaryContext: unknown
) => {
  let contextValue =
    productSummaryContext !== undefined ? productSummaryContext : productContext
  let productId = pathOr('', ['product', 'productId'], contextValue)
  let productName = pathOr('', ['product', 'productName'], contextValue)
  let itemId = pathOr('', ['selectedItem', 'itemId'], contextValue)
  return { productName, productId, itemId }
}
const ProductSelector = ({ showToast, intl }: Props) => {
  const { push }: any = usePixel()
  const cssHandles = useCssHandles(CSS_HANDLES)
  const [isChecked, setIsChecked] = useState(false)
  const valuesFromContext = useProductSummary()
  const valuesFromProductContext = useProduct()
  const { productId, productName, itemId } = getContextValue(
    valuesFromProductContext,
    valuesFromContext
  )
  const { useProductComparisonState, useProductComparisonDispatch } =
    ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const isDrawerCollapsed = pathOr(false, ['isDrawerCollapsed'], comparisonData)
  const productsSelected = pathOr([], ['products'], comparisonData)
  const maxItemsToCompare = pathOr(
    0,
    ['maxNumberOfItemsToCompare'],
    comparisonData
  )

  useEffect(() => {
    const selectedProducts =
      productId && itemId
        ? find(
            allPass([propEq('productId', productId), propEq('skuId', itemId)])
          )(productsSelected)
        : []

    setIsChecked(selectedProducts && !isEmpty(selectedProducts))
  }, [productsSelected, itemId, productId])

  const showMessage = (message: string, show = true) => {
    if (showToast && show) {
      showToast({
        message,
      })
    }
  }

  const productSelectorChanged = (e: { target: { checked: boolean } }) => {
    if (e.target.checked && productsSelected.length === maxItemsToCompare) {
      setIsChecked(false)
      showMessage(`${intl.formatMessage(messages.comparisonUpperLimit)}`, true)
    } else if (e.target.checked) {
      dispatchComparison({
        args: {
          product: { productId, skuId: itemId },
        },
        type: 'ADD',
      })
      showMessage(
        `${intl.formatMessage(
          messages.product
        )} "${productName}" ${intl.formatMessage(messages.added)}`,
        isDrawerCollapsed
      )
    } else {
      dispatchComparison({
        args: {
          product: { productId, skuId: itemId },
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
  }

  const productSelectionOnClicked = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    push({
      event: 'compareProducts',
      products: [valuesFromContext?.product],
      action: 'add',
    })
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
        label={intl.formatMessage(messages.compare)}
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorChanged}
        value={isChecked}
      />
    </div>
  )
}

export default withToast(injectIntl(ProductSelector))
