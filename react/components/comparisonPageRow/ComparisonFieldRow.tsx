import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import './row.css'

const CSS_HANDLES = ['rowContainer', 'fieldNameCol']

interface Props {
  field: ComparisonField
}

const ComparisonFieldRow: StorefrontFunctionComponent<Props> = ({
  field,
}: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  return field && field.name && field.fieldType && field.showOnSite ? (
    <div
      className={`${cssHandles.rowContainer} flex flex-row`}
      key={`field-${field.name}`}
    >
      <div
        className={`${cssHandles.fieldNameCol} w-20 flex items-center ma1 pa3`}
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
