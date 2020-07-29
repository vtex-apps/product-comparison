import React, { useMemo } from 'react'
import { uniq, pathOr, find, propEq } from 'ramda'

import ComparisonContext from '../../ProductComparisonContext'
import productsQuery from '../../queries/productsByIdentifier.graphql'
import { useQuery } from 'react-apollo'
import { ExtensionPoint } from 'vtex.render-runtime'
import { mapCatalogProductToProductSummary } from '../utils/normalize'

const ComparisonList = () => {
  const { useProductComparisonState } = ComparisonContext

  const comparisonData = useProductComparisonState()
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  const { data: productsResponse, error, loading } = useQuery(productsQuery, {
    skip: !(comparisonProducts && comparisonProducts.length > 0),
    variables: {
      ids: uniq(comparisonProducts.map(product => parseInt(product.productId))),
    },
  })

  const productsToCompare = useMemo(() => {
    const productList = pathOr([], ['productsByIdentifier'], productsResponse)
    return !(productList.length > 0)
      ? []
      : comparisonProducts.map(productInfo => {
          const selectedProduct = find(
            propEq('productId', productInfo.productId.toString())
          )(productList)

          return mapCatalogProductToProductSummary(
            selectedProduct,
            productInfo.skuId
          )
        })
  }, [comparisonProducts, productsResponse])

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="mw9 w-100 center flex flex-row mt6 pa3">
      {productsToCompare.map(product => {
        // eslint-disable-next-line react/jsx-key
        return (
          <div
            key={product && product.productId ? product.productId : 'product'}
            className="w-20"
          >
            <ExtensionPoint id="product-summary" product={product} />
          </div>
        )
      })}
    </div>
  )
}

export default ComparisonList
