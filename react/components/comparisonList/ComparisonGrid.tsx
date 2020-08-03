import React, { useMemo } from 'react'
import { pathOr, findLast, propEq } from 'ramda'
import ComparisonGridRow from './ComparisonGridRow'
import ComparisonProductContext from './ComparisonProductContext'

interface Props {
  maxItemCount: number
  columnStyles: Styles
  fields: ComparisonField[]
}

const ComparisonGrid = ({ columnStyles, fields }: Props) => {
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

    const specificationsList: string[] = allProductSpecificationsList.reduce(
      (accumulator: string[], currentValue: string[]) => {
        return [...new Set([...accumulator, ...currentValue])]
      },
      [] as string[]
    )

    const productSpecificationFields = specificationsList.map(
      specificationName => ({
        type: 'ProductSpecificationField',
        name: specificationName,
        displayValue: specificationName,
        showOnSite: true,
      })
    )

    return productSpecificationFields
  }, [products])

  const skuSpecificationFields: ComparisonField[] = useMemo(() => {
    const allSkuSpecificationsList: string[][] = products.map(product => {
      // const skus = pathOr([], ['items'], product)

      // const skuSpecificationsList = skus.map(sku =>
      //   pathOr([], ['skuSpecifications'], sku)
      // )

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

    const specificationsList: string[] = allSkuSpecificationsList.reduce(
      (accumulator: string[], currentValue: string[]) => {
        return [...new Set([...accumulator, ...currentValue])]
      },
      [] as string[]
    )

    const skuSpecificationFieldsList = specificationsList.map(
      specificationName => ({
        type: 'SkuSpecificationField',
        name: specificationName,
        displayValue: specificationName,
        showOnSite: true,
      })
    )

    return skuSpecificationFieldsList
  }, [products])

  fields =
    fields && fields.length > 0
      ? fields
      : [
          {
            type: 'ProductField',
            name: 'productName',
            displayValue: 'Product Name',
            showOnSite: true,
          },
          {
            type: 'ProductField',
            name: 'brand',
            displayValue: 'Brand',
            showOnSite: true,
          },
          {
            type: 'ProductField',
            name: 'description',
            displayValue: 'Product Description',
            showOnSite: true,
          },
          {
            type: 'ProductField',
            name: 'productReference',
            displayValue: 'Product Reference',
            showOnSite: true,
          },
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

export default ComparisonGrid
