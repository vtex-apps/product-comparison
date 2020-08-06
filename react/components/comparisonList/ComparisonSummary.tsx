import React from 'react'
import { useQuery } from 'react-apollo'
import { path } from 'ramda'
import { ExtensionPoint } from 'vtex.render-runtime'
import productsQuery from 'vtex.store-resources/QueryProduct'

import { mapCatalogProductToProductSummary } from '../utils/normalize'
import styles from './comparisonList.css'

interface Props {
  productToCompare: ProductToCompare
  columnStyles: Styles
}

const ComparisonSummary = ({ productToCompare, columnStyles }: Props) => {
  const { data, loading, error } = useQuery(productsQuery, {
    variables: {
      identifier: {
        field: 'id',
        value: productToCompare.productId,
      },
    },
  })

  const product: Product | undefined = path(['product'], data)

  const productDetails = product
    ? mapCatalogProductToProductSummary(product, productToCompare.skuId)
    : {}

  if (loading || error) {
    return <p>Loading...</p>
  }

  return (
    <div
      key={productToCompare?.productId ? productToCompare.productId : 'product'}
      className={`${styles.comparisonProductCol} ma1 pa3`}
      style={columnStyles}
    >
      <ExtensionPoint id="product-summary" product={productDetails} />
    </div>
  )
}

export default ComparisonSummary
