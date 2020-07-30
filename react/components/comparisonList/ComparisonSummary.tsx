import React, { useMemo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { mapCatalogProductToProductSummary } from '../utils/normalize'
import styles from './comparisonList.css'

interface Props {
  product: Product
  productToCompare: ProductToCompare
  columnStyles: Styles
}

const ComparisonSummary = ({
  product,
  productToCompare,
  columnStyles,
}: Props) => {
  const productDetails = useMemo(() => {
    return product
      ? mapCatalogProductToProductSummary(product, productToCompare.skuId)
      : {}
  }, [productToCompare, product])

  return (
    <div
      key={
        productToCompare && productToCompare.productId
          ? productToCompare.productId
          : 'product'
      }
      className={`${styles.comparisonProductCol} ma1 pa3`}
      style={columnStyles}
    >
      <ExtensionPoint id="product-summary" product={productDetails} />
    </div>
  )
}

export default ComparisonSummary
