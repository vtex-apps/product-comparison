import React, { useMemo } from 'react'
import { pathOr, find, findLast, propEq, sort, uniq } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonContext from '../../ProductComparisonContext'
import { getSkuSpecificationFields } from '../utils/fieldUtils'

interface Props {
  skuSpecificationsToHide?: string
}

const SkuSpecifications = ({ skuSpecificationsToHide }: Props) => {
  const { useComparisonProductState } = ComparisonProductContext
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
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

    if (comparisonData.products && comparisonData.showDifferences) {
      const allVariations: Variation[][] = comparisonData.products.map(
        comparisonItem => {
          const selectedProduct = find(
            propEq('productId', comparisonItem.productId)
          )(products)
          const selectedSku = find(propEq('itemId', comparisonItem.skuId))(
            pathOr([], ['items'], selectedProduct)
          )

          return pathOr([], ['variations'], selectedSku)
        }
      )

      const a = skuSpecificationFieldsList.map(field => {
        const specifications = allVariations.map(variations => {
          return findLast(propEq('name', field.name))(variations)
        })
        const specificationValues = specifications.map(
          (specification: ProductSpecification) => {
            const specs = pathOr([], ['values'], specification)
            return sort(
              (a: string, b: string) => a.localeCompare(b),
              specs
            ).join(',')
          }
        )
        const uniqueSpecifications = uniq(specificationValues)

        return {
          ...field,
          ...{ showOnSite: uniqueSpecifications.length !== 1 },
        }
      })

      return a
    }

    return skuSpecificationFieldsList
  }, [comparisonData, products, skuSpecificationsToHide])

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