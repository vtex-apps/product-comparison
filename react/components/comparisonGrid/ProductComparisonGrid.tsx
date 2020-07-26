import React, { useMemo } from 'react'
import { uniq, pathOr, find, propEq } from 'ramda'

import ComparisonContext from '../../ProductComparisonContext'
import productsQuery from '../../queries/productsByIdentifier.graphql'
import { useQuery } from 'react-apollo'
import GridRow from './GridRow'

const ProductComparisonGrid = () => {
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
      ids: uniq(comparisonProducts.map(product => product.productId)),
    },
  })

  const productsToCompare: ComparisonItem[] = useMemo(() => {
    const productList = pathOr([], ['productsByIdentifier'], productsResponse)
    return !(productList.length > 0)
      ? []
      : comparisonProducts.map(productInfo => {
          const selectedProduct = find(
            propEq('productId', productInfo.productId.toString())
          )(productList)
          const selectedSku = find(
            propEq('itemId', productInfo.skuId.toString())
          )(pathOr([], ['items'], selectedProduct))
          return {
            imageUrl: pathOr('', ['images', 0, 'imageUrl'], selectedSku),
            product: selectedProduct,
            selectedSku: selectedSku,
          }
        })
  }, [comparisonProducts, productsResponse])

  const fieldsToCompare = ['productName', 'description', 'brand']
  //const skuFieldsToCompare = ['name']

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="mw9 w-100 center flex flex-column mt6 pa3">
      <GridRow
        comparisonItems={productsToCompare}
        field={'imageUrl'}
        fieldType={'image'}
      />
      {fieldsToCompare.map(field => {
        // eslint-disable-next-line react/jsx-key
        return (
          <GridRow
            key={field}
            comparisonItems={productsToCompare}
            field={field}
            fieldType={'productField'}
          />
        )
      })}
    </div>
  )
}

// ProductComparisonPage.schema = {
//   title: 'editor.countdown.title',
//   description: 'editor.countdown.description',
//   type: 'object',
//   properties: {
//   },
// }

export default ProductComparisonGrid
