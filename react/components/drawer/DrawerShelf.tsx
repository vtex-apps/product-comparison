// import React, { useState } from 'react'
// import { path, pathOr } from 'ramda'
// import { IconCaret } from 'vtex.store-icons'
// import styles from './drawer.css'
// import classNames from 'classnames'
// import ComparisonContext from '../../ProductComparisonContext'
// // import { mapCatalogProductToProductSummary } from '../utils/normalize'

// import { Slider, Slide, SliderContainer } from 'vtex.slider'
// import resolveSlidesNumber from '../utils/resolveSlidesNumber'
// import { withCssHandles } from 'vtex.css-handles'

// import CustomProductSummary from '../comparisonSummary/CustomProductSummary'

// const SLIDER_WIDTH_ONE_ELEMENT = 320
// const SLIDER_WIDTH_TWO_ELEMENTS = 500
// const SLIDER_WIDTH_THREE_ELEMENTS = 750
// const SLIDER_WIDTH_FOUR_ELEMENTS = 1000
// const SLIDER_WIDTH_FIVE_ELEMENTS = 1290
// const DEFAULT_SHELF_ITEM_WIDTH = 260

// const CSS_HANDLES = [
//   'arrow',
//   'arrowLeft',
//   'arrowRight',
//   'shelfContentContainer',
//   'sliderContainer',
//   'slide',
//   'dot--isActive',
// ]

// interface Props {
//   cssHandles?: any
//   gap: string
//   scroll: string
//   arrows: boolean
//   itemsPerPage: number
//   minItemsPerPage: number
// }

// const DrawerShelf = (props: Props) => {
//   const { useProductComparisonState } = ComparisonContext

//   const comparisonData = useProductComparisonState()
//   const products = pathOr(
//     [] as ProductToCompare[],
//     ['products'],
//     comparisonData
//   )

//   // const productDetails = useMemo(() => {
//   //   return product
//   //     ? mapCatalogProductToProductSummary(product, productToCompare.skuId)
//   //     : {}
//   // }, [productToCompare, product])
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [firstRender, setFirstRender] = useState(false)

//   const {
//     gap = 'ph3',
//     scroll = 'BY_PAGE',
//     arrows = true,
//     isMobile,
//     maxItems,
//     cssHandles,
//     itemsPerPage,
//     navigationStep,
//     minItemsPerPage,
//     paginationDotsVisibility,
//   } = props

//   const perPage = {
//     [SLIDER_WIDTH_FIVE_ELEMENTS]: 5,
//     [SLIDER_WIDTH_FOUR_ELEMENTS]: 4,
//     [SLIDER_WIDTH_THREE_ELEMENTS]: 3,
//     [SLIDER_WIDTH_TWO_ELEMENTS]: 2,
//     [SLIDER_WIDTH_ONE_ELEMENT]: 1,
//   }

//   // const calcItemsPerPage = () => {
//   //   // const { itemsPerPage } = this.props
//   //   for (const key in perPage) {
//   //     if (perPage[number(key)] > itemsPerPage) delete perPage[key]
//   //   }
//   // }

//   const handleChangeSlide = (i: number) => {
//     setCurrentSlide(i)
//   }
//   const roundHalf = (num: number) => Math.round(num * 2) / 2

//   const handleNextSlide = () => {
//     // const { currentSlide } = this.state
//     // const { itemsPerPage, maxItems, products, isMobile } = this.props
//     const productList =
//       !products || !products.length ? Array(maxItems).fill(null) : products
//     const totalItems = productList.slice(0, maxItems).length
//     let customPerPage = (!isMobile && itemsPerPage) || 1 //perPage

//     /** Fix for a case where customPerPage would come from this.perPage,
//      * which would be an object, and would cause nextSlide to be cast into
//      * a string in the sum below. This was a quick fix, feel free to improve
//      * this code later on if you judge it necessary.
//      */
//     if (typeof customPerPage !== 'number') {
//       let minPerPage = minItemsPerPage
//       if (typeof minPerPage !== 'number') {
//         minPerPage = 1
//       }
//       customPerPage = resolveSlidesNumber(
//         roundHalf(minPerPage),
//         customPerPage,
//         isMobile
//       )
//     }
//     const nextSlide = (currentSlide % totalItems) + customPerPage

//     handleChangeSlide(nextSlide)
//   }

//   const arrowRender = ({ orientation, onClick }: any) => {
//     // const { gap, cssHandles } = this.props
//     const containerClasses = classNames(
//       cssHandles.arrow,
//       'pointer z-1 flex absolute',
//       {
//         [`${cssHandles.arrowLeft} left-0 ${gap}`]: orientation === 'left',
//         [`${cssHandles.arrowRight} right-0 ${gap}`]: orientation === 'right',
//       }
//     )
//     return (
//       <div
//         className={containerClasses}
//         onClick={onClick}
//         role="button"
//         tabIndex={0}
//         onKeyPress={(e: any) => {
//           e.key === 'Enter' || (e.key === ' ' && onClick(e))
//         }}
//       >
//         <IconCaret orientation={orientation} thin size={20} />
//       </div>
//     )
//   }

//   const isScrollByPage = scroll === 'BY_PAGE'

//   const productList =
//     !products || !products.length ? Array(maxItems).fill(null) : products

//   const roundedMinItems = roundHalf(minItemsPerPage)
//   // const customPerPage = !isMobile && itemsPerPage

//   return (
//     <div className={`${cssHandles.shelfContentContainer} flex justify-center`}>
//       <SliderContainer
//         autoplay={autoplay}
//         onNextSlide={handleNextSlide}
//         className={`${cssHandles.sliderContainer} w-100 mw9`}
//       >
//         <Slider
//           loop
//           easing="ease"
//           duration={500}
//           minPerPage={roundedMinItems}
//           scrollByPage={isScrollByPage}
//           navigationStep={navigationStep}
//           currentSlide={Math.ceil(currentSlide)}
//           onChangeSlide={handleChangeSlide}
//           perPage={perPage} //customPerPage ||
//           arrowRender={arrows && arrowRender}
//         >
//           {productList.slice(0, maxItems).map((item, index) => (
//             <Slide
//               sliderTransitionDuration={500}
//               className={classNames(
//                 'justify-center h-100',
//                 gap,
//                 cssHandles.slide
//               )}
//               key={path(['productId'], item) || index}
//               defaultWidth={DEFAULT_SHELF_ITEM_WIDTH}
//             >
//               <CustomProductSummary productToCompare={item} />
//             </Slide>
//           ))}
//         </Slider>
//       </SliderContainer>
//     </div>
//   )

//   // return (
//   //   <div className={`${styles.comparisonProductCol} ma1 pa3`}>
//   //     TEST
//   //     {/* <ExtensionPoint id="product-summary" product={productDetails} /> */}
//   //   </div>
//   // )
// }

// export default withCssHandles(CSS_HANDLES)(DrawerShelf)
