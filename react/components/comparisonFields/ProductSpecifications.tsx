import React, { useMemo } from 'react'
import { pathOr, findLast, propEq } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
// import ComparisonContext from '../../ProductComparisonContext'
import { getProductSpecificationFields } from '../utils/fieldUtils'

interface Props {
  productSpecificationsToHide?: string
}

const ProductSpecifications = ({ productSpecificationsToHide }: Props) => {
  const { useComparisonProductState } = ComparisonProductContext
  // const { useProductComparisonState } = ComparisonContext

  // const comparisonData = useProductComparisonState()
  const productData = useComparisonProductState()
  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  const allProductSpecificationsList: ComparisonField[] = useMemo(() => {
    const allProductSpecificationsList: ProductSpecification[][] = products.map(
      product => {
        const groups = pathOr([], ['specificationGroups'], product)
        const allSpecifications = findLast(propEq('name', 'allSpecifications'))(
          groups
        )
        return pathOr([], ['specifications'], allSpecifications)
      }
    )

    let specificationsList: string[] = allProductSpecificationsList.reduce(
      (accumulator: string[], currentValue: ProductSpecification[]) => {
        const current = currentValue.map(specification =>
          pathOr('', ['name'], specification)
        )
        return [...new Set([...accumulator, ...current])]
      },
      [] as string[]
    )

    specificationsList = getProductSpecificationFields(
      specificationsList,
      productSpecificationsToHide
    )

    const productSpecificationFields = specificationsList.map(
      specificationName => ({
        fieldType: 'ProductSpecificationField',
        name: specificationName,
        displayValue: specificationName,
        showOnSite: true,
      })
    )

    return productSpecificationFields
  }, [productSpecificationsToHide, products])

  // const isCommon: boolean = (specificationName: string, productSpecifications: Specification[]) => {

  //   allProductSpecifications.

  //   return false
  // }

  // const specificationFieldsToDisplay = useMemo(() => {
  //   let specifications = ProductSpecifications
  //   if (comparisonData.showDifferences) {

  //   }
  //   return specifications
  // }, [ProductSpecifications, products, comparisonData])

  return allProductSpecificationsList.map((field: ComparisonField) => {
    return <ComparisonFieldRow key={`field-${field.name}`} field={field} />
  })
}

ProductSpecifications.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    productSpecificationsToHide: {
      title:
        'admin/editor.comparison-grid.product-specifications-to-be-removed.title',
      description:
        'admin/editor.comparison-grid.product-specifications-to-be-removed.description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}

export default ProductSpecifications
