import React from 'react'
import { pathOr } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import ComparisonGridCell from './ComparisonGridCell'
import styles from './comparisonList.css'

interface Props {
  field: ComparisonField
  columnStyles: Styles
}

const ComparisonGridRow: StorefrontFunctionComponent<Props> = ({
  field,
  columnStyles,
}: Props) => {
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  return field && field.name && field.fieldType ? (
    <div className="flex flex-row" key={`field-${field.name}`}>
      <div
        className={`${styles.comparisonNameCol} flex items-center ma1 pa3`}
        style={columnStyles}
      >
        <span>{field.displayValue}</span>
      </div>
      {comparisonProducts.map(comparisonItem => {
        return (
          <div
            key={`${comparisonItem.productId}-col`}
            className={`${styles.comparisonProductCol} ma1 pa3`}
            style={columnStyles}
          >
            <ComparisonGridCell
              field={field}
              productToCompare={comparisonItem}
            />
          </div>
        )
      })}
    </div>
  ) : (
    <div />
  )
}

ComparisonGridRow.schema = {
  title: 'admin/editor.comparison-grid-row.title',
  description: 'admin/editor.comparison-grid-row.description',
  type: 'object',
  properties: {
    field: {
      title: 'admin/editor.comparison-grid-row.field.title',
      description: 'admin/editor.comparison-grid-row.field.description',
      type: 'object',
      fieldType: {
        title: 'admin/editor.comparison-grid-row.field.fieldType.title',
        description:
          'admin/editor.comparison-grid-row.field.fieldType.description',
        type: 'string',
        enum: [
          'ProductField',
          'SkuField',
          'ProductSpecificationField',
          'SkuSpecificationField',
        ],
        enumNames: [
          'Product Field',
          'Sku Field',
          'Product Specification',
          'Sku Specification',
        ],
        default: 'ProductField',
      },
      name: {
        title: 'admin/editor.comparison-grid-row.field.name.title',
        type: 'string',
        description: 'admin/editor.comparison-grid-row.field.name.description',
      },
      displayValue: {
        title: 'admin/editor.comparison-grid-row.field.display-value.title',
        type: 'string',
        description:
          'admin/editor.comparison-grid-row.field.display-value.description',
      },
    },
    columnStyles: {
      title: 'admin/editor.comparison-grid-row.styles.title',
      type: 'object',
      width: {
        title: 'admin/editor.comparison-grid-row.styles.width.title',
        type: 'string',
        description:
          'admin/editor.comparison-grid-row.styles.width.description',
      },
    },
  },
}

export default ComparisonGridRow
