import React, { useState, useEffect } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
import { useCssHandles } from 'vtex.css-handles'
import { Checkbox } from 'vtex.styleguide'
import ComparisonProductContext from '../../ComparisonProductContext'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import './row.css'

const CSS_HANDLES = [
  'productSummaryRowContainer',
  'fieldNameCol',
  'showDifferencesContainer',
]

interface Props extends InjectedIntlProps {}

const messages = defineMessages({
  onlyShowDifferences: {
    defaultMessage: '',
    id: 'store/product-comparison.product-summary.checkbox.only-differences',
  },
})

const ProductSummaryRow = ({ intl }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const [showDifferences, setShowDifferences] = useState(false)

  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext

  const { useComparisonProductState } = ComparisonProductContext

  const productData = useComparisonProductState()
  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )
  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  useEffect(() => {
    const showDifferences =
      comparisonData.products &&
      comparisonData.products.length > 1 &&
      comparisonData.showDifferences
    setShowDifferences(showDifferences)
  }, [comparisonData])

  const onSelectorChanged = (e: { target: { checked: boolean } }) => {
    dispatchComparison({
      args: {
        showDifferences: e.target.checked,
      },
      type: 'SET_SHOW_DIFFERENCES',
    })
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div
      className={`mw9 ${cssHandles.productSummaryRowContainer} flex flex-row mt6 pa3`}
    >
      <div className={`${cssHandles.fieldNameCol} w-20 flex items-end ma1 pa3`}>
        {comparisonProducts.length > 1 && products ? (
          <div className={`${cssHandles.showDifferencesContainer} mb3`}>
            <Checkbox
              checked={showDifferences}
              id={`id-differences`}
              label={intl.formatMessage(messages.onlyShowDifferences)}
              name={`name-differences`}
              onChange={onSelectorChanged}
              value={showDifferences}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
      <ExtensionPoint id="list-context.comparison-product-summary-slider" />
    </div>
  )
}

export default injectIntl(ProductSummaryRow)
