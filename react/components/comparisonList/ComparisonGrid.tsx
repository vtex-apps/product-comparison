import React from 'react'
import ComparisonGridRow from './ComparisonGridRow'

interface Props {
  maxItemCount: number
  columnStyles: Styles
}

const ComparisonGrid = ({ columnStyles }: Props) => {
  const fields: ComparisonField[] = [
    { type: 'ProductField', name: 'productName', text: 'Product Name' },
    { type: 'ProductField', name: 'brand', text: 'Brand' },
    { type: 'ProductField', name: 'description', text: 'Product Description' },
    {
      type: 'ProductField',
      name: 'productReference',
      text: 'Product Reference',
    },
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
