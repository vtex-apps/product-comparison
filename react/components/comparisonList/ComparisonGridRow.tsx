import React from 'react'
import { pathOr, find, propEq } from 'ramda'
import ComparisonProductContext from './ComparisonProductContext'
import ComparisonContext from '../../ProductComparisonContext'
import styles from './comparisonList.css'

interface Props {
  field: ComparisonField
  columnStyles: Styles
}

const ComparisonGridRow = ({ field, columnStyles }: Props) => {
  const { useProductComparisonState } = ComparisonContext
  const { useComparisonProductState } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const productData = useComparisonProductState()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  const getFieldValue = (productId: string, skuId: string) => {
    const selectedProduct = find(propEq('productId', productId))(products)
    const selectedSku = find(propEq('itemId', skuId))(
      pathOr([], ['items'], selectedProduct)
    )

    let value: string | number = ''

    switch (field.type) {
      case 'ProductField':
        value = pathOr('', [field.name], selectedProduct)
        break
      case 'SkuField':
        value = pathOr('', [field.name], selectedSku)
        break
      default:
        break
    }
    return value
  }

  return field && field.name && field.type ? (
    <div className="flex flex-row" key={`field-${field.name}`}>
      <div
        className={`${styles.comparisonNameCol} flex items-center ma1 pa3`}
        style={columnStyles}
      >
        <span>{field.text}</span>
      </div>
      {comparisonProducts.map(comparisonItem => {
        return (
          <div
            key={`${comparisonItem.productId}-col`}
            className={`${styles.comparisonProductCol} ma1 pa3`}
            style={columnStyles}
          >
            <span>
              {getFieldValue(comparisonItem.productId, comparisonItem.skuId)}
            </span>
          </div>
        )
      })}
    </div>
  ) : (
    <div />
  )
}

export default ComparisonGridRow
