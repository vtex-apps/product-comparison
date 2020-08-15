import React, { useMemo } from 'react'
import { pathOr, find, findLast, propEq, sort, uniq } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonContext from '../../ProductComparisonContext'
import { getSkuSpecificationFields } from '../utils/fieldUtils'
import { useCssHandles } from 'vtex.css-handles'
import './fieldGroup.css'

const CSS_HANDLES = ['title']

interface Props {
  titleText: string
  skuSpecificationsToHide?: string
}

const SkuSpecifications = ({ skuSpecificationsToHide, titleText }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
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

      return skuSpecificationFieldsList.map(field => {
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
    }

    return skuSpecificationFieldsList
  }, [comparisonData, products, skuSpecificationsToHide])

  return (
    <div>
      <div className={`${cssHandles.title} pa5 b`}>
        <span>{titleText}</span>
      </div>
      <div>
        {skuSpecificationFields.map((field: ComparisonField) => (
          <ComparisonFieldRow key={`field-${field.name}`} field={field} />
        ))}
      </div>
    </div>
  )
}

SkuSpecifications.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    titleText: {
      title: 'admin/editor.comparison-grid.titleText.title',
      type: 'string',
    },
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
