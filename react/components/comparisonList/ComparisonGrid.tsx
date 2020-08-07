import React, { useMemo } from 'react'
import { pathOr, findLast, propEq } from 'ramda'
import ComparisonGridRow from './ComparisonGridRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import {
  getProductFields,
  getSkuFields,
  getProductSpecificationFields,
  getSkuSpecificationFields,
} from '../utils/fieldUtils'

interface Props {
  columnStyles: Styles
  productFieldsToHide?: string
  skuFieldsToHide?: string
  productSpecificationsToHide?: string
  skuSpecificationsToHide?: string
}

const ComparisonGrid = ({
  columnStyles,
  productFieldsToHide,
  skuFieldsToHide,
  productSpecificationsToHide,
  skuSpecificationsToHide,
}: Props) => {
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

  const fields: ComparisonField[] = [
    ...getProductFields(productFieldsToHide),
    ...getSkuFields(skuFieldsToHide),

    ...productSpecificationFields,
    ...skuSpecificationFields,
  ]

  return fields.map((field: ComparisonField) => {
    return (
      <ComparisonGridRow
        key={`field-${field.name}`}
        columnStyles={columnStyles}
        field={field}
      />
    )
  })
}

ComparisonGrid.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    productFieldsToHide: {
      title: 'admin/editor.comparison-grid.product-fields-to-be-removed.title',
      description:
        'admin/editor.comparison-grid.product-fields-to-be-removed.description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    skuFieldsToHide: {
      title: 'admin/editor.comparison-grid.sku-fields-to-be-removed.title',
      description:
        'admin/editor.comparison-grid.sku-fields-to-be-removed.description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
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

export default ComparisonGrid
