import React, { useMemo } from 'react'
import { pathOr, findLast, propEq, sort, uniq } from 'ramda'
import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonContext from '../../ProductComparisonContext'
import { getProductSpecificationFields } from '../utils/fieldUtils'
import { useCssHandles } from 'vtex.css-handles'
import './fieldGroup.css'

const CSS_HANDLES = ['title']

interface Props {
  titleText: string
  productSpecificationsToHide?: string
}

const ProductSpecifications = ({
  productSpecificationsToHide,
  titleText,
}: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { useComparisonProductState } = ComparisonProductContext
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
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

    if (comparisonData.showDifferences) {
      return productSpecificationFields.map(field => {
        const specifications = allProductSpecificationsList.map(
          specifications => {
            return findLast(propEq('name', field.name))(specifications)
          }
        )
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

    return productSpecificationFields
  }, [productSpecificationsToHide, products, comparisonData])

  return allProductSpecificationsList &&
    allProductSpecificationsList.length > 0 ? (
    <div className="mt3">
      <div className={`${cssHandles.title} pa5 b`}>
        <span>{titleText}</span>
      </div>
      <div>
        {allProductSpecificationsList.map((field: ComparisonField) => (
          <ComparisonFieldRow key={`field-${field.name}`} field={field} />
        ))}
      </div>
    </div>
  ) : (
    <div />
  )
}

ProductSpecifications.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    titleText: {
      title: 'admin/editor.comparison-grid.titleText.title',
      type: 'string',
    },
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
