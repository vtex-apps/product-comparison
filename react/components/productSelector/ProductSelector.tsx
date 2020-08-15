/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, MouseEvent } from 'react'
import { pathOr, find, propEq, allPass, isEmpty } from 'ramda'
import { Checkbox, withToast } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import ComparisonContext from '../../ProductComparisonContext'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

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
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
}

const ProductSelector = ({ showToast, intl }: Props) => {
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
  const productName = pathOr('', ['product', 'productName'], valuesFromContext)
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

  const showMessage = (message: string) => {
    if (showToast) {
      showToast({
        message: message,
      })
    }
  }

  const productSelectorChanged = (e: { target: { checked: boolean } }) => {
    if (e.target.checked) {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'ADD',
      })
      showMessage(
        `${intl.formatMessage(
          messages.product
        )} "${productName}" ${intl.formatMessage(messages.added)}`
      )
    } else {
      dispatchComparison({
        args: {
          product: { productId: productId, skuId: itemId },
        },
        type: 'REMOVE',
      })
      showMessage(
        `${intl.formatMessage(
          messages.product
        )} "${productName}" ${intl.formatMessage(messages.removed)}`
      )
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
        label={intl.formatMessage(messages.compare)}
        name={`${productId}-${itemId}-product-comparison`}
        onChange={productSelectorChanged}
        value={isChecked}
      />
    </div>
  )
}

export default withToast(injectIntl(ProductSelector))
