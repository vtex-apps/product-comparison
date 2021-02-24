import React, { useState, useEffect } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
import { useCssHandles } from 'vtex.css-handles'
import { Checkbox } from 'vtex.styleguide'
import ComparisonProductContext from '../../ComparisonProductContext'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import './row.css'

interface ProductSummaryRowProps {
  isShowDifferenceDefault: boolean
}

const messages = defineMessages({
  showDifferences: {
    defaultMessage: '',
    id: 'store/product-comparison.product-summary-row.show-differences',
  },
})

const CSS_HANDLES = [
  'productSummaryRowContainer',
  'fieldNameCol',
  'showDifferencesContainer',
]

const ProductSummaryRow = ({
  isShowDifferenceDefault,
  intl,
}: ProductSummaryRowProps & InjectedIntlProps) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const [isShowDifferenceByDefault, changesChecked] = useState(
    isShowDifferenceDefault
  )
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
      (comparisonData.showDifferences || isShowDifferenceByDefault)
    setShowDifferences(showDifferences)
  }, [comparisonData, isShowDifferenceByDefault])
  const onSelectorChanged = (e: { target: { checked: boolean } }) => {
    changesChecked(!isShowDifferenceByDefault)
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
              label={intl.formatMessage(messages.showDifferences)}
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
ProductSummaryRow.schema = {
  title: 'editor.product-summary-row.title',
  description: 'editor.product-summary-row.description',
  type: 'object',
  properties: {
    isShowDifferenceDefault: {
      title: 'Show difference',
      description: '',
      default: false,
      type: 'boolean',
    },
  },
}

export default injectIntl(ProductSummaryRow)
