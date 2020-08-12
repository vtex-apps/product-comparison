import React from 'react'
import styles from './comparisonList.css'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  field: ComparisonField
}

const ComparisonFieldRow: StorefrontFunctionComponent<Props> = ({
  field,
}: Props) => {
  return field && field.name && field.fieldType ? (
    <div className="flex flex-row" key={`field-${field.name}`}>
      <div
        className={`${styles.comparisonNameCol} w-20 flex items-center ma1 pa3`}
      >
        <span>{field.displayValue}</span>
      </div>
      <ExtensionPoint id="list-context.comparison-row" field={field} />
    </div>
  ) : (
    <div />
  )
}
export default ComparisonFieldRow
