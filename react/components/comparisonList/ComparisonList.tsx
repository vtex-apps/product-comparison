import React, { useEffect, useState } from 'react'
import { pathOr, isEmpty, find, propEq } from 'ramda'
import { useApolloClient } from 'react-apollo'
import productsQuery from 'vtex.store-resources/QueryProduct'
import { ExtensionPoint } from 'vtex.render-runtime'
import ComparisonContext from '../../ProductComparisonContext'
import ComparisonSummary from './ComparisonSummary'
import styles from './comparisonList.css'
import ComparisonProductContext from './ComparisonProductContext'

interface Props {
  maxItemCount: number
}

const ComparisonList = ({ maxItemCount = 4 }: Props) => {
  const [products, setProducts] = useState([] as Product[])
  const client = useApolloClient()

  const { useProductComparisonState } = ComparisonContext
  const { ComparisonProductProvider } = ComparisonProductContext

  const comparisonData = useProductComparisonState()
  const comparisonProducts = pathOr(
    [] as ProductToCompare[],
    ['products'],
    comparisonData
  )

  useEffect(() => {
    // const results =
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseProducts: Product[] = productsList.map(
        (productResponse: { data: { product: Product } }) =>
          // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
          pathOr({} as Product, ['data', 'product'], productResponse)
      )

      setProducts(responseProducts)
    })
  }, [client, comparisonProducts])

  const comparisonListStyles = {
    columnWidth: { width: `${maxItemCount > 5 ? 100 / maxItemCount : 15}%` },
  }

  return isEmpty(comparisonProducts) ? (
    <div />
  ) : (
    <ComparisonProductProvider products={products}>
      <div className="mw9 w-100 center">
        <div className={`${styles.productSummaryRow} flex flex-row mt6 pa3`}>
          <div
            className={`${styles.comparisonNameCol} flex items-center ma1 pa3`}
            style={comparisonListStyles.columnWidth}
          >
            <span>Products</span>
          </div>
          {comparisonProducts.map(product => {
            return (
              <ComparisonSummary
                key={`product-summary-${product.skuId}`}
                productToCompare={product}
                product={find(propEq('productId', product.productId))(products)}
                columnStyles={comparisonListStyles.columnWidth}
              />
            )
          })}
        </div>
        <div className={`${styles.productComparisonGrid}`}>
          <ExtensionPoint
            id="product-comparison-block"
            maxItemCount={maxItemCount}
            columnStyles={comparisonListStyles.columnWidth}
          />
        </div>
      </div>
    </ComparisonProductProvider>
  )
}

export default ComparisonList
