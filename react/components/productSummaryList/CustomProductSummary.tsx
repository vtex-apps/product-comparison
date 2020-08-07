// import React, { useMemo } from 'react'
// import { pathOr, find, propEq } from 'ramda'
// import { ExtensionPoint } from 'vtex.render-runtime'
// import { mapCatalogProductToProductSummary } from '../utils/normalize'
// import styles from './comparisonList.css'

// import ComparisonProductContext from '../../ComparisonProductContext'

// interface Props {
//   productToCompare: ProductToCompare
// }

// const CustomProductSummary = ({ productToCompare }: Props) => {
//   const { useComparisonProductState } = ComparisonProductContext
//   const productData = useComparisonProductState()

//   const productDetails = useMemo(() => {
//     const products = pathOr([] as ProductToCompare[], ['products'], productData)
//     const selectedProduct = find(
//       propEq('productId', productToCompare.productId)
//     )(products)

//     return selectedProduct
//       ? mapCatalogProductToProductSummary(
//           selectedProduct,
//           productToCompare.skuId
//         )
//       : {}
//   }, [productData, productToCompare])

//   return (
//     <div
//       key={
//         productToCompare && productToCompare.productId
//           ? productToCompare.productId
//           : 'product'
//       }
//       className={`${styles.comparisonProductCol} ma1 pa3`}
//     >
//       <ExtensionPoint id="product-summary" product={productDetails} />
//     </div>
//   )
// }

// export default CustomProductSummary
