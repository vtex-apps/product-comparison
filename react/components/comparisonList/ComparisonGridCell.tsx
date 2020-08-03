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

  if (field.type === 'ProductField') {
    return <span>{pathOr('', [field.name], selectedProduct)}</span>
  }

  if (field.type === 'SkuField') {
    return <span>{pathOr('', [field.name], selectedSku)}</span>
  }

  if (field.type === 'ProductSpecificationField') {
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
            <span key={`${field.type}-${field.name}-${value}`}>{value}</span>
          )
        })}
      </div>
    )
  }

  if (field.type === 'SkuSpecificationField') {
    const skuSpecifications = pathOr([], ['skuSpecifications'], selectedProduct)
    const fieldValue = skuSpecifications.map(specification => ({
      name: pathOr('', ['field', 'name'], specification),
      values: pathOr('', ['values'], specification),
    }))
    const values = pathOr(
      [],
      ['values'],
      find(propEq('name', field.name))(fieldValue)
    )
    return (
      <div className={`${styles.skuSpecifications} flex flex-column`}>
        {values.map(value => {
          return (
            <span key={`${field.type}-${field.name}`}>
              {pathOr('', ['name'], value)}
            </span>
          )
        })}
      </div>
    )
  }

  return <div></div>
}

export default ComparisonGridCell
