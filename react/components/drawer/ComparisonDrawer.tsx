import React, { useMemo } from 'react'
import { pathOr, uniq, find, propEq, isEmpty } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import productsQuery from '../../queries/productsByIdentifier.graphql'
import { useQuery } from 'react-apollo'
import styles from './drawer.css'
import { Button } from 'vtex.styleguide'
import ProductThumbnail from './ProductThumbnail'

const ComparisonDrawer = () => {
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
            productId: pathOr('', ['productId'], selectedProduct),
            skuId: pathOr('', ['itemId'], selectedSku),
            imageUrl: pathOr('', ['images', 0, 'imageUrl'], selectedSku),
            productName: pathOr('', ['productName'], selectedProduct),
            skuName: pathOr('', ['name'], selectedSku),
          }
        })
  }, [comparisonProducts, productsResponse])

  const removeAllItems = () => {
    dispatchComparison({
      type: 'REMOVE_ALL',
    })
  }

  // eslint-disable-next-line no-console
  console.log(loading)
  return error ? (
    <div>{error}</div>
  ) : isEmpty(thumbnailItems) ? (
    <div />
  ) : (
    <div className={`${styles.drawerContainer} mw9 w-100 flex justify-center`}>
      <div className={`${styles.drawer} flex flex-row justify-center pl3 pr3`}>
        {thumbnailItems.map(thumbnail => {
          return (
            <ProductThumbnail
              key={`${thumbnail.productId}-${thumbnail.skuId}`}
              productThumbnail={thumbnail}
            />
          )
        })}
        <div className={`${styles.comparisonButtons} flex flex-column ma3`}>
          <div className="">
            <Button
              block
              size="small"
              className={`${styles.compareProductsButton} ma3`}
              href="/compare"
            >
              Compare
            </Button>
          </div>
          <div className="mt3">
            <Button
              block
              variation="danger-tertiary"
              size="small"
              onClick={removeAllItems}
            >
              Remove All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonDrawer
