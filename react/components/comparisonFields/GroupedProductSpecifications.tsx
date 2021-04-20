import React, { useMemo } from 'react'
import { contains, pathOr, keys, findLast, propEq, sort, uniq } from 'ramda' // , findLast, propEq, sort, uniq,
import { useCssHandles } from 'vtex.css-handles'

import ComparisonFieldRow from '../comparisonPageRow/ComparisonFieldRow'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonContext from '../../ProductComparisonContext'
import { splitString } from '../utils/fieldUtils'
import './fieldGroup.css'

const CSS_HANDLES = ['title']

interface Props {
  showGroupName: boolean
  productSpecificationsToHide?: string
  productSpecificationGroupsToHide?: string
}

const GroupedProductSpecifications = ({
  productSpecificationsToHide,
  productSpecificationGroupsToHide,
}: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { useComparisonProductState } = ComparisonProductContext
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const productData = useComparisonProductState()
  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  const specificationsToHide = splitString(productSpecificationsToHide)
  const specificationGroupsToHide = splitString(
    productSpecificationGroupsToHide
  )

  const allProductSpecificationsList: GroupedComparisonFields = useMemo(() => {
    const allProductSpecificationGroups: ProductSpecificationGroup[][] = products.map(
      (product) => {
        return pathOr([], ['specificationGroups'], product)
      }
    )

    const groupedSpecifications = allProductSpecificationGroups.reduce(
      (
        accumulator: SpecificationGroupValues,
        productSpecificationGroups: ProductSpecificationGroup[]
      ) => {
        productSpecificationGroups.forEach(
          (specificationGroup: ProductSpecificationGroup) => {
            const groupName = pathOr('', ['name'], specificationGroup)
            const specifications = pathOr(
              [],
              ['specifications'],
              specificationGroup
            )

            if (
              groupName !== '' &&
              !contains(groupName, specificationGroupsToHide) &&
              specifications.length > 0
            ) {
              const groupedSpecifications = pathOr(
                [] as ProductSpecification[],
                [groupName],
                accumulator
              )

              specifications.forEach((specification: ProductSpecification) => {
                const isExists = groupedSpecifications.find(
                  (s: ProductSpecification) => s.name == specification.name
                )

                if (
                  !isExists &&
                  !contains(specification.name, specificationsToHide)
                ) {
                  const gSpec: ProductSpecification = {
                    ...specification,
                    ...{ groupName },
                  }

                  groupedSpecifications.push(gSpec)
                }
              })

              accumulator = {
                ...accumulator,
                ...{ [groupName]: groupedSpecifications },
              }
            }
          }
        )

        return accumulator
      },
      {}
    )

    const selectedGroups = keys(groupedSpecifications)

    const groupedComparisonFields = selectedGroups.reduce(
      (accumulator: GroupedComparisonFields, currentValue: string | number) => {
        const specifications = pathOr([], [currentValue], groupedSpecifications)
        const fields: ComparisonField[] = specifications.map(
          (specification: ProductSpecification) => ({
            fieldType: 'GroupedSpecification',
            groupName: currentValue.toString(),
            name: specification.name,
            displayValue: specification.name,
            showOnSite: true,
          })
        )

        return {
          ...accumulator,
          ...{ [currentValue]: fields },
        }
      },
      {}
    )

    if (comparisonData.showDifferences) {
      const differentComparisonFields = selectedGroups.reduce(
        (
          accumulator: GroupedComparisonFields,
          currentValue: string | number
        ) => {
          const specificationFields = pathOr(
            [],
            [currentValue],
            groupedComparisonFields
          )

          const differentFields = [] as ComparisonField[]

          specificationFields.forEach((field: ComparisonField) => {
            const specificationFieldValues = products.map(
              (product: Product) => {
                const groupedSpecification = findLast(
                  propEq('name', field.groupName)
                )(pathOr([], ['specificationGroups'], product))

                const specifications = pathOr(
                  [],
                  ['specifications'],
                  groupedSpecification
                )

                const selectedSpecification = findLast(
                  propEq('name', field.name)
                )(specifications)

                const specs = pathOr([], ['values'], selectedSpecification)

                return sort(
                  (a: string, b: string) => a.localeCompare(b),
                  specs
                ).join(',')
              }
            )

            const uniqueSpecifications = uniq(specificationFieldValues)

            if (uniqueSpecifications.length !== 1) {
              differentFields.push(field)
            }
          })

          return {
            ...accumulator,
            ...{ [currentValue]: differentFields },
          }
        },
        {}
      )

      return differentComparisonFields
    }

    return groupedComparisonFields
  }, [
    comparisonData.showDifferences,
    products,
    specificationGroupsToHide,
    specificationsToHide,
  ])

  const selectedGroups = keys(allProductSpecificationsList)

  return selectedGroups && selectedGroups.length > 0 ? (
    selectedGroups.map((groupName: string | number) => {
      const specifications: ComparisonField[] = pathOr(
        [],
        [groupName],
        allProductSpecificationsList
      )

      return (
        specifications.length > 0 && (
          <div key={groupName} className="mt3">
            <div className={`${cssHandles.title} pa5 b`}>
              <span>{groupName}</span>
            </div>
            <div>
              {specifications.map((field: ComparisonField) => (
                <ComparisonFieldRow key={`field-${field.name}`} field={field} />
              ))}
            </div>
          </div>
        )
      )
    })
  ) : (
    <div />
  )
}

GroupedProductSpecifications.schema = {
  title: 'admin/editor.comparison-grid.title',
  description: 'admin/editor.comparison-grid.description',
  type: 'object',
  properties: {
    showGroupName: {
      title: 'admin/editor.comparison-grid.titleText.title',
      type: 'boolean',
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
    productSpecificationGroupsToHide: {
      title:
        'admin/editor.comparison-grid.product-specification-groups-to-be-removed.title',
      description:
        'admin/editor.comparison-grid.product-specification-groups-to-be-removed.description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}

export default GroupedProductSpecifications
