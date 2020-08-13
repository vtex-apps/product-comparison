import React, { ReactChildren, ReactChild } from 'react'
import { pathOr, isEmpty } from 'ramda'
import { withCssHandles } from 'vtex.css-handles'
import { Layout, PageHeader, PageBlock, Button } from 'vtex.styleguide'
import ComparisonContext from './ProductComparisonContext'
import './global.css'

const CSS_HANDLES = ['pageContainer']

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cssHandles?: any
  children: ReactChildren | ReactChild
}

const ComparisonPage = ({ children, cssHandles }: Props) => {
  const {
    useProductComparisonState,
    useProductComparisonDispatch,
  } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const dispatchComparison = useProductComparisonDispatch()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const removeAllItems = () => {
    dispatchComparison({
      type: 'REMOVE_ALL',
    })
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <div className={`${cssHandles.pageContainer} mw9 center`}>
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title={`Compare ${comparisonProducts.length} products`}
            linkLabel="Back to products list"
          >
            <Button
              variation="tertiary"
              size="regular"
              onClick={removeAllItems}
            >
              Clear All
            </Button>
          </PageHeader>
        }
      >
        <PageBlock>{children}</PageBlock>
      </Layout>
    </div>
  )
}

export default withCssHandles(CSS_HANDLES)(ComparisonPage)
