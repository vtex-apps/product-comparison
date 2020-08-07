import React from 'react'
import styles from './comparisonList.css'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  field: ComparisonField
}

const ComparisonGridRow: StorefrontFunctionComponent<Props> = ({
  field,
}: Props) => {
  return field && field.name && field.fieldType ? (
    <div className="flex flex-row" key={`field-${field.name}`}>
      <div
        className={`${styles.comparisonNameCol} w-20 flex items-center ma1 pa3`}
      >
        <span>{field.displayValue}</span>
      </div>
      <ExtensionPoint id="list-context.comparison-row-list" field={field} />
      {/* {comparisonProducts.map(comparisonItem => {
        return (
          <div
            key={`${comparisonItem.productId}-col`}
            className={`${styles.comparisonProductCol} w-20 ma1 pa3`}
          >
            <ComparisonGridCell
              field={field}
              productToCompare={comparisonItem}
            />
          </div>
        )
      })} */}
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
    // columnStyles: {
    //   title: 'admin/editor.comparison-grid-row.styles.title',
    //   type: 'object',
    //   width: {
    //     title: 'admin/editor.comparison-grid-row.styles.width.title',
    //     type: 'string',
    //     description:
    //       'admin/editor.comparison-grid-row.styles.width.description',
    //   },
    // },
  },
}

export default ComparisonGridRow
