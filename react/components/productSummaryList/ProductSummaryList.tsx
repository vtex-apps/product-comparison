import React, { useMemo, ReactChildren, ReactChild } from 'react'
import { pathOr, propEq, find } from 'ramda'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { ProductListContext } from 'vtex.product-list-context'

import { mapCatalogProductToProductSummary } from '../utils/normalize'
import ProductSummeryListEventCaller from './ProductSummeryListEventCaller'

import ComparisonContext from '../../ProductComparisonContext'

import ComparisonProductContext from '../../ComparisonProductContext'

interface Props {
  children: ReactChildren | ReactChild
  products: Product[]
  comparisonProducts: ProductToCompare[]
}

const List = ({ children, products, comparisonProducts }: Props) => {
  const { list } = useListContext()
  const { treePath } = useTreePath()

  const newListContextValue = useMemo(() => {
    const componentList =
      comparisonProducts &&
      products &&
      comparisonProducts.map(comparisonProduct => {
        const selectedProduct = find(
          propEq('productId', comparisonProduct.productId)
        )(products)

        const normalizedProduct = mapCatalogProductToProductSummary(
          selectedProduct,
          comparisonProduct.skuId
        )

        return (
          <ExtensionPoint
            id="product-summary"
            key={`${comparisonProduct.productId}-${comparisonProduct.skuId}`}
            treePath={treePath}
            product={normalizedProduct}
          />
        )
      })

    return list.concat(componentList)
  }, [comparisonProducts, list, products, treePath])

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const ProductSummaryList = ({ children }: Props) => {
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

  // return (
  //   <ProductListProvider>
  //     <List products={products} comparisonProducts={comparisonProducts}>
  //       {children}
  //     </List>
  //     <ProductSummeryListEventCaller />
  //   </ProductListProvider>
  // )

  return products &&
    comparisonProducts &&
    comparisonProducts.length > 0 &&
    products.length > 0 &&
    products.length === comparisonProducts.length ? (
    <ProductListProvider>
      <List products={products} comparisonProducts={comparisonProducts}>
        {children}
      </List>
      <ProductSummeryListEventCaller />
    </ProductListProvider>
  ) : (
    <div />
  )
}

export default ProductSummaryList
