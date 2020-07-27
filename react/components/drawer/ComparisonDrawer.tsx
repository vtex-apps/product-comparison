import React, { useMemo } from 'react'
import { pathOr, uniq, find, propEq } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import productsQuery from '../../queries/productsByIdentifier.graphql'
import { useQuery } from 'react-apollo'
import styles from './drawer.css'

const ComparisonDrawer = () => {
  const {
    useProductComparisonState,
    // useProductComparisonDispatch,
  } = ComparisonContext

  const comparisonData = useProductComparisonState()
  // const dispatchComparison = useProductComparisonDispatch()

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

  const thumbnailItems: ComparisonThumbnail[] = useMemo(() => {
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
            productName: pathOr('', ['productName'], selectedProduct),
            skuName: pathOr('', ['name'], selectedSku),
          }
        })
  }, [comparisonProducts, productsResponse])

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className={`${styles.drawerContainer} mw9 w-100 flex justify-center`}>
      <div className={`${styles.drawer} flex flex-row justify-center`}>
        {thumbnailItems.map(thumbnail => {
          return (
            <div
              className="ma3"
              key={`${thumbnail.productName}-${thumbnail.skuName}`}
            >
              <div className={`${styles.drawerImageContainer} pa3`}>
                <img
                  className={`${styles.drawerImage}`}
                  alt={thumbnail.productName}
                  src={thumbnail.imageUrl}
                />
              </div>
              <div>
                <span>{thumbnail.skuName}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComparisonDrawer
