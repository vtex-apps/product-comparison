import type { ReactChildren, ReactChild } from 'react'
import React, { useMemo } from 'react'
import { pathOr } from 'ramda'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { ProductListContext } from 'vtex.product-list-context'
import { useCssHandles } from 'vtex.css-handles'

import ProductSummeryListEventCaller from '../productSummaryList/ProductSummeryListEventCaller'
import ComparisonContext from '../../ProductComparisonContext'
import ComparisonProductContext from '../../ComparisonProductContext'
import ComparisonFieldValue from './ComparisonFieldValue'
import './row.css'

const CSS_HANDLES = ['comparisonCol']

interface Props {
  field: ComparisonField
  children: ReactChildren | ReactChild
  products: Product[]
  comparisonProducts: ProductToCompare[]
}

const List = ({ children, comparisonProducts, field }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { list } = useListContext()

  const newListContextValue = useMemo(() => {
    const componentList =
      comparisonProducts &&
      comparisonProducts.map((comparisonProduct) => {
        return (
          <div
            key={`${comparisonProduct.productId}-col`}
            className={`${cssHandles.comparisonCol} w-100 ma1 pa3`}
          >
            <ComparisonFieldValue
              field={field}
              productToCompare={comparisonProduct}
            />
          </div>
        )
      })

    return list.concat(componentList)
  }, [comparisonProducts, cssHandles, field, list])

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const ComparisonGridRowContent = ({ children, field }: Props) => {
  const { ProductListProvider } = ProductListContext
  const { useProductComparisonState } = ComparisonContext
  const { useComparisonProductState } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const productData = useComparisonProductState()

  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const products = pathOr([] as ProductToCompare[], ['products'], productData)

  return (
    <ProductListProvider listName="row-content">
      <List
        products={products}
        comparisonProducts={comparisonProducts}
        field={field}
      >
        {children}
      </List>
      <ProductSummeryListEventCaller />
    </ProductListProvider>
  )
}

export default ComparisonGridRowContent
