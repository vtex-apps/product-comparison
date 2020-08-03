import React from 'react'
import { pathOr } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import styles from './comparisonList.css'
import ComparisonGridCell from './ComparisonGridCell'

interface Props {
  field: ComparisonField
  columnStyles: Styles
}

const ComparisonGridRow = ({ field, columnStyles }: Props) => {
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  return field && field.name && field.type ? (
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

export default ComparisonGridRow
