import React, { useMemo } from 'react'
import { pathOr } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import { getSkuSpecificationFields } from '../utils/fieldUtils'

interface Props {
  skuSpecificationsToHide?: string
}

const SkuSpecifications = ({ skuSpecificationsToHide }: Props) => {
  const { useComparisonProductState } = ComparisonProductContext

  const productData = useComparisonProductState()
  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  const skuSpecificationFields: ComparisonField[] = useMemo(() => {
    const allSkuSpecificationsList: string[][] = products.map(product => {
      const skuSpecificationsList = pathOr([], ['skuSpecifications'], product)
      const skuSpecificationNamesList: string[] = skuSpecificationsList.reduce(
        (accumulator: string[], currentValue) => {
          return [
            ...new Set([
              ...accumulator,
              pathOr('', ['field', 'name'], currentValue),
            ]),
          ]
        },
        [] as string[]
      )

      return skuSpecificationNamesList.filter(name => name !== '')
    })

    let specificationsList: string[] = allSkuSpecificationsList.reduce(
      (accumulator: string[], currentValue: string[]) => {
        return [...new Set([...accumulator, ...currentValue])]
      },
      [] as string[]
    )

    specificationsList = getSkuSpecificationFields(
      specificationsList,
      skuSpecificationsToHide
    )

    const skuSpecificationFieldsList = specificationsList.map(
      specificationName => ({
        fieldType: 'SkuSpecificationField',
        name: specificationName,
        displayValue: specificationName,
        showOnSite: true,
      })
    )

    return skuSpecificationFieldsList
  }, [products, skuSpecificationsToHide])

  return skuSpecificationFields.map((field: ComparisonField) => {
    return <ComparisonFieldRow key={`field-${field.name}`} field={field} />
  })
}

SkuSpecifications.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    skuSpecificationsToHide: {
      title:
        'admin/editor.comparison-grid.sku-specifications-to-be-removed.title',
      description:
        'admin/editor.comparison-grid.sku-specifications-to-be-removed.description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}

export default SkuSpecifications
