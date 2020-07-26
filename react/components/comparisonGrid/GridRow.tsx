import React from 'react'
import GridCell from './GridCell'
import { pathOr } from 'ramda'

interface Props {
  comparisonItems: ComparisonItem[]
  field: string
  fieldType: string
}

const GridRow = ({ comparisonItems, field, fieldType }: Props) => {
  const dynamicProps = {
    gridCell: {
      width: `${100 / (comparisonItems.length + 1)}%`,
    },
  }

  return (
    <div className="flex flex-row">
      <div className="pa3" style={dynamicProps.gridCell}>
        {field}
      </div>
      {comparisonItems.map(comparisonItem => {
        return (
          <GridCell
            key={pathOr('', ['product', 'cacheId'], comparisonItem)}
            comparisonItem={comparisonItem}
            field={field}
            fieldType={fieldType}
            cellStyles={dynamicProps.gridCell}
          />
        )
      })}
    </div>
  )
}

export default GridRow
