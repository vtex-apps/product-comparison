import React from 'react'
import ComparisonContext from '../../ProductComparisonContext'
import styles from './drawer.css'

interface Props {
  productThumbnail: ComparisonThumbnail
}

const ProductThumbnail = ({ productThumbnail }: Props) => {
  const { useProductComparisonDispatch } = ComparisonContext

  const dispatchComparison = useProductComparisonDispatch()

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

  return (
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
