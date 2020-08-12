import React, { ReactChildren, ReactChild } from 'react'

interface Props {
  children: ReactChildren | ReactChild
}
const ComparisonPage = ({ children }: Props) => {
  return <div>{children}</div>
}

export default ComparisonPage
