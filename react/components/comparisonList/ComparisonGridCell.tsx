import React from 'react'
import { pathOr, find, propEq, findLast } from 'ramda'
import ComparisonProductContext from './ComparisonProductContext'
import styles from './comparisonList.css'

interface Props {
  productToCompare: ProductToCompare
  field: ComparisonField
}
const ComparisonGridCell = ({ field, productToCompare }: Props) => {
  const { useComparisonProductState } = ComparisonProductContext
  const productData = useComparisonProductState()

  const products = pathOr([] as ProductToCompare[], ['products'], productData)
  const selectedProduct = find(propEq('productId', productToCompare.productId))(
    products
  )
  const selectedSku = find(propEq('itemId', productToCompare.skuId))(
    pathOr([], ['items'], selectedProduct)
  )

  if (field.fieldType === 'ProductField') {
    return <span>{pathOr('', [field.name], selectedProduct)}</span>
  }

  if (field.fieldType === 'SkuField') {
    return <span>{pathOr('', [field.name], selectedSku)}</span>
  }

  if (field.fieldType === 'ProductSpecificationField') {
    const groups = pathOr([], ['specificationGroups'], selectedProduct)
    const allSpecifications = findLast(propEq('name', 'allSpecifications'))(
      groups
    )
    const specifications = pathOr([], ['specifications'], allSpecifications)

    const values = pathOr(
      [],
      ['values'],
      find(propEq('name', field.name))(specifications)
    )
    return (
      <div className={`${styles.productSpecifications} flex flex-column`}>
        {values.map(value => {
          return (
            <span key={`${field.fieldType}-${field.name}-${value}`}>
              {value}
            </span>
          )
        })}
      </div>
    )
  }

  if (field.fieldType === 'SkuSpecificationField') {
    const skuSpecifications = pathOr([], ['variations'], selectedSku)
    const values = pathOr(
      [],
      ['values'],
      find(propEq('name', field.name))(skuSpecifications)
    )
    return (
      <div className={`${styles.skuSpecifications} flex flex-column`}>
        {values.map(value => {
          return (
            <span key={`${field.fieldType}-${field.name}-${value}`}>
              {value}
            </span>
          )
        })}
      </div>
    )
  }

  return <div></div>
}

export default ComparisonGridCell
