import React, { useMemo } from 'react'
import { path } from 'ramda'
import productsQuery from 'vtex.store-resources/QueryProduct'
import { useQuery } from 'react-apollo'
import { ExtensionPoint } from 'vtex.render-runtime'
import { mapCatalogProductToProductSummary } from '../utils/normalize'

interface Props {
  productToCompare: ProductToCompare
}

const ComparisonSummary = ({ productToCompare }: Props) => {
  const { data: productsResponse, error, loading } = useQuery(productsQuery, {
    skip: !(productToCompare && productToCompare.productId),
    variables: {
      identifier: {
        field: 'id',
        value: productToCompare.productId,
      },
    },
  })

  const productDetails = useMemo(() => {
    const selectedProduct: Product | undefined = path(
      ['product'],
      productsResponse
    )

    return selectedProduct
      ? mapCatalogProductToProductSummary(
          selectedProduct,
          productToCompare.skuId
        )
      : {}
  }, [productToCompare, productsResponse])

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div
      key={
        productToCompare && productToCompare.productId
          ? productToCompare.productId
          : 'product'
      }
      className="w-20"
    >
      <ExtensionPoint id="product-summary" product={productDetails} />
    </div>
  )
}

export default ComparisonSummary
