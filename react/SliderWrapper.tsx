import React from 'react'
import { defineMessages } from 'react-intl'
import { useListContext } from 'vtex.list-context'
import { useResponsiveValue } from 'vtex.responsive-values'

import Slider from './components/Slider'
import { SliderContextProvider } from './components/SliderContext'

const SliderWrapper: StorefrontFunctionComponent<
  SliderLayoutProps & SliderLayoutSiteEditorProps
> = ({
  totalItems,
  infinite = false,
  showNavigationArrows = 'always',
  showPaginationDots = 'always',
  usePagination = true,
  fullWidth = true,
  arrowSize = 25,
  children,
  ...contextProps
}) => {
  const list = useListContext()?.list ?? []
  const totalSlides = totalItems ?? React.Children.count(children) + list.length
  const responsiveArrowIconSize = useResponsiveValue(arrowSize)
  const slides = React.Children.toArray(children).concat(list)

  return (
    <SliderContextProvider
      infinite={infinite}
      slides={slides}
      totalItems={totalSlides}
      {...contextProps}
    >
      <Slider
        infinite={infinite}
        showNavigationArrows={showNavigationArrows}
        showPaginationDots={showPaginationDots}
        totalItems={totalSlides}
        usePagination={usePagination}
        fullWidth={fullWidth}
        arrowSize={responsiveArrowIconSize}
      >
        {children}
      </Slider>
    </SliderContextProvider>
  )
}

const messages = defineMessages({
  sliderTitle: {
    id: 'admin/editor.slider-layout.title',
    defaultMessage: '',
  },
  sliderInfinite: {
    id: 'admin/editor.slider-layout.infinite',
    defaultMessage: '',
  },
  sliderShowNavigation: {
    id: 'admin/editor.slider-layout.showNavigation',
    defaultMessage: '',
  },
  sliderShowPaginationDots: {
    id: 'admin/editor.slider-layout.showPaginationDots',
    defaultMessage: '',
  },
  sliderUsePagination: {
    id: 'admin/editor.slider-layout.usePagination',
    defaultMessage: '',
  },
  sliderFullWidth: {
    id: 'admin/editor.slider-layout.sliderFullWidth',
    defaultMessage: '',
  },
  sliderFullWidthDescription: {
    id: 'admin/editor.slider-layout.sliderFullWidthDescription',
    defaultMessage: '',
  },
})

SliderWrapper.schema = {
  title: messages.sliderTitle.id,
  type: 'object',
  properties: {
    autoplay: {
      type: 'object',
      isLayout: true,
      properties: {
        timeout: {
          type: 'number',
        },
        stopOnHover: {
          type: 'boolean',
        },
      },
    },
    itemsPerPage: {
      type: 'object',
      isLayout: true,
      properties: {
        desktop: {
          default: 5,
          type: 'number',
        },
        tablet: {
          default: 3,
          type: 'number',
        },
        phone: {
          default: 1,
          type: 'number',
        },
      },
    },
  },
}

export default SliderWrapper
