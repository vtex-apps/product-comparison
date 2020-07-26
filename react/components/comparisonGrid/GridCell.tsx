import React from 'react'
import { pathOr } from 'ramda'

interface Props {
  comparisonItem: ComparisonItem
  field: string
  fieldType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellStyles?: any | unknown
}

const GridCell = ({ comparisonItem, fieldType, field, cellStyles }: Props) => {
  return (
    <div
      className="pa3"
      key={pathOr('', ['product', 'cacheId'], comparisonItem)}
      style={cellStyles}
    >
      {fieldType === 'image' ? (
        <div>
          <img
            alt={pathOr('', ['product', 'productName'], comparisonItem)}
            src={pathOr('', [field], comparisonItem)}
          />
        </div>
      ) : fieldType === 'productField' ? (
        <span>{pathOr('', ['product', field], comparisonItem)}</span>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default GridCell
