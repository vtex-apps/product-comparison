import React, { useState, useEffect } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
import { useCssHandles } from 'vtex.css-handles'
import { Checkbox } from 'vtex.styleguide'
import ComparisonProductContext from '../../ComparisonProductContext'
import './row.css'
import { usePixel } from 'vtex.pixel-manager'

const CSS_HANDLES = [
  'productSummaryRowContainer',
  'fieldNameCol',
  'showDifferencesContainer',
]

const ProductSummaryRow = () => {
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

  const { push } = usePixel()

  const pixelEvent = (products: object, length: number) => {
    if (!!length && length >= 2) {
      push({
        event: 'productComparison',
        products,
        compareProductN: length,
      })
    }
  }
  useEffect(() => {
    pixelEvent(comparisonData.products, comparisonData.products.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
              label="Show only differences"
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

export default ProductSummaryRow
