import React, { useMemo } from 'react'
import { pathOr, findLast, propEq } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import { getProductSpecificationFields } from '../utils/fieldUtils'

interface Props {
  productSpecificationsToHide?: string
}

const ProductSpecifications = ({ productSpecificationsToHide }: Props) => {
  const { useComparisonProductState } = ComparisonProductContext

  const productData = useComparisonProductState()
  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  const productSpecificationFields: ComparisonField[] = useMemo(() => {
    const allProductSpecificationsList: string[][] = products.map(product => {
      const groups = pathOr([], ['specificationGroups'], product)
      const allSpecifications = findLast(propEq('name', 'allSpecifications'))(
        groups
      )
      return pathOr([], ['specifications'], allSpecifications).map(
        specification => pathOr('', ['name'], specification)
      )
    })

    let specificationsList: string[] = allProductSpecificationsList.reduce(
      (accumulator: string[], currentValue: string[]) => {
        return [...new Set([...accumulator, ...currentValue])]
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

  return productSpecificationFields.map((field: ComparisonField) => {
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
