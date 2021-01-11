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
  comparisonUpperLimit: {
    defaultMessage: '',
    id: 'store/product-comparison.product-selector.upper-limit-exceeded',
  }
})

interface Props extends InjectedIntlProps {
  showToast?: (input: ToastInput) => void
  withCondition?: boolean
}

const ProductSelector = ({ showToast, intl, withCondition }: Props) => {
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

  const showMessage = (message: string, show: boolean = true) => {
    if (showToast && show) {
      showToast({
        message: message,
      })
    }
  }

  const categoryArrayLength = valuesFromContext?.product?.categories.length;
  const categoryAvailable = categoryArrayLength === 1 ? valuesFromContext?.product?.categories[0] : valuesFromContext?.product?.categories[categoryArrayLength - 2]

  const productSelectorChanged = (e: { target: { checked: boolean } }) => {
    if (e.target.checked && productsSelected.length === maxItemsToCompare) {
      setIsChecked(false)
      showMessage(`${intl.formatMessage(messages.comparisonUpperLimit)}`, true)
    } else if (e.target.checked) {
      dispatchComparison({
        args: {
          product: {
            productId: productId,
            skuId: itemId,
            categoryId: categoryAvailable,
          },
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
          product: {
            productId: productId,
            skuId: itemId,
            categoryId: categoryAvailable,
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
  }

  const productSelectionOnClicked = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const categoryCheck = (comparisonData?.products[0]?.categoryId &&
    categoryAvailable !== comparisonData?.products[0]?.categoryId)

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
        disabled={
          withCondition &&
          categoryCheck
        }
      />
    </div>
  )
}

export default withToast(injectIntl(ProductSelector))
