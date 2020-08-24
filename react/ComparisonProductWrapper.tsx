import React, { useEffect, useState, ReactChildren, ReactChild } from 'react'
import { pathOr } from 'ramda'
// import { pathOr, propEq, find } from 'ramda'
import productsQuery from 'vtex.store-resources/QueryProduct'
import { useApolloClient } from 'react-apollo'
import ComparisonContext from './ProductComparisonContext'
import ComparisonProductContext from './ComparisonProductContext'
// import { mapCatalogProductToProductSummary } from './components/utils/normalize'

interface Props {
  children: ReactChildren | ReactChild
}
const ComparisonProductWrapper = ({ children }: Props) => {
  const [products, setProducts] = useState([] as Product[])
  const client = useApolloClient()

  const { ComparisonProductProvider } = ComparisonProductContext
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  useEffect(() => {
    Promise.all(
      comparisonProducts.map((productToCompare: ProductToCompare) => {
        return client.query({
          query: productsQuery,
          variables: {
            identifier: {
              field: 'id',
              value: productToCompare.productId,
            },
          },
        })
      })
    ).then((productsList: { data: { product: Product } }[]) => {
      const responseProducts: Product[] = productsList.map(
        (productResponse: { data: { product: Product } }) =>
          // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
          pathOr({} as Product, ['data', 'product'], productResponse)
      )

      // const productSummaryProducts = comparisonProducts.map(productInfo => {
      //   const selectedProduct = find(
      //     propEq('productId', productInfo.productId)
      //   )(responseProducts)

      //   return mapCatalogProductToProductSummary(
      //     selectedProduct,
      //     productInfo.skuId
      //   )
      // })

      // setProducts(productSummaryProducts)

      setProducts(responseProducts)
    })
  }, [client, comparisonProducts])

  return (
    <ComparisonProductProvider
      products={comparisonProducts.length > 0 ? products : []}
    >
      {children}
    </ComparisonProductProvider>
  )
}

export default ComparisonProductWrapper
