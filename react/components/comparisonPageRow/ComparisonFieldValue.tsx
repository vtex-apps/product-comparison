import React from 'react'
import { pathOr, find, propEq, findLast } from 'ramda'
import ComparisonProductContext from '../../ComparisonProductContext'
import { useCssHandles } from 'vtex.css-handles'
import './row.css'

const CSS_HANDLES = [
  'productFieldValue',
  'skuFieldValue',
  'productSpecificationValues',
  'productSpecificationValue',
  'skuSpecificationValues',
  'skuSpecificationValue',
]

interface Props {
  productToCompare: ProductToCompare
  field: ComparisonField
}
const ComparisonFieldValue = ({ field, productToCompare }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
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
    return (
      <span className={cssHandles.productFieldValue}>
        {pathOr('', [field.name], selectedProduct)}
      </span>
    )
  }

  if (field.fieldType === 'SkuField') {
    return (
      <span className={cssHandles.skuFieldValue}>
        {pathOr('', [field.name], selectedSku)}
      </span>
    )
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
      <div
        className={`${cssHandles.productSpecificationValues} flex flex-column`}
      >
        {values.map(value => {
          return (
            <span
              className={cssHandles.productSpecificationValue}
              key={`${field.fieldType}-${field.name}-${value}`}
            >
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
      <div className={`${cssHandles.skuSpecificationValues} flex flex-column`}>
        {values.map(value => {
          return (
            <span
              className={cssHandles.skuSpecificationValue}
              key={`${field.fieldType}-${field.name}-${value}`}
            >
              {value}
            </span>
          )
        })}
      </div>
    )
  }

  return <div></div>
}

export default ComparisonFieldValue
