import React, { useMemo } from 'react'
import { pathOr, find, propEq } from 'ramda'
import ComparisonContext from '../../ProductComparisonContext'
import { useQuery } from 'react-apollo'
import styles from './drawer.css'

import productsQuery from '../../queries/productThumbnails.graphql'

interface Props {
  productToCompare: ProductToCompare
}

const ProductThumbnail = ({ productToCompare }: Props) => {
  const { useProductComparisonDispatch } = ComparisonContext

  const dispatchComparison = useProductComparisonDispatch()

  const { data: productsResponse, error } = useQuery(productsQuery, {
    skip: !(productToCompare && productToCompare.productId),
    variables: {
      identifier: {
        field: 'id',
        value: productToCompare.productId,
      },
    },
  })

  const productThumbnail: ComparisonThumbnail = useMemo(() => {
    const selectedProduct = pathOr({}, ['product'], productsResponse)
    const selectedSku = find(propEq('itemId', productToCompare.skuId))(
      pathOr([], ['items'], selectedProduct)
    )
    return {
      productId: pathOr('', ['productId'], selectedProduct),
      skuId: pathOr('', ['itemId'], selectedSku),
      imageUrl: pathOr('', ['images', 0, 'imageUrl'], selectedSku),
      productName: pathOr('', ['productName'], selectedProduct),
      skuName: pathOr('', ['name'], selectedSku),
    }
  }, [productToCompare, productsResponse])

  const removeProductFromCompare = () => {
    dispatchComparison({
      args: {
        product: {
          productId: productThumbnail.productId,
          skuId: productThumbnail.skuId,
        },
      },
      type: 'REMOVE',
    })
  }

  return error ? (
    <div>{error}</div>
  ) : (
    <div
      className={`${styles.productThumbnail} pa3 w-100 flex br b--light-gray`}
      key={`${productThumbnail.productId}-${productThumbnail.skuId}`}
    >
      <div
        className={`${styles.thumbnailContentContainer} w-100 flex items-center-l`}
      >
        <img
          className={`${styles.drawerImage}`}
          alt={productThumbnail.productName}
          src={productThumbnail.imageUrl}
        />
        <div className="flex flex-column pl3 mw4 w-100">
          <span className="f6 i small b dark-gray">Item #</span>
          <span className="f6 small b truncate">
            {productThumbnail.skuName}
          </span>
        </div>
      </div>
      <button
        className={`${styles.closeButton}`}
        onClick={removeProductFromCompare}
      >
        X
      </button>
    </div>
  )
}

export default ProductThumbnail
