import React, { FC, useEffect, useRef } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { useSliderState, useSliderDispatch } from './SliderContext'

const CSS_HANDLES = ['sliderTrack', 'slide', 'slideChildrenContainer'] as const

interface Props {
  totalItems: number
  infinite: boolean
}

const isSlideVisible = ({
  index,
  currentSlide,
  slidesToShow,
  totalItems,
}: {
  index: number
  currentSlide: number
  slidesToShow: number
  totalItems: number
}): boolean => {
  const isClonedSlide = currentSlide < 0 || currentSlide >= totalItems

  return (
    (index >= currentSlide && index < currentSlide + slidesToShow) ||
    isClonedSlide
  )
}

const resolveAriaAttributes = (
  visible: boolean,
  index: number,
  totalItems: number
) => {
  if (index < 0 || index >= totalItems) {
    return {
      'aria-hidden': !visible,
      role: 'none presentation',
    }
  }

  return {
    'aria-hidden': visible,
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} of ${totalItems}`,
  }
}

const getFirstOrLastVisible = (slidesPerPage: number, index: number) => {
  // every multiple of the number of slidesPerPage is a first (e.g. 0,3,6 if slidesPerPage is 3)
  if (index % slidesPerPage === 0) {
    return 'firstVisible'
  }
  // every slide before  the multiple of the number of slidesPerPage is a last (e.g. 2,5,8 if slidesPerPage is 3)
  if ((index + 1) % slidesPerPage === 0) {
    return 'lastVisible'
  }

  return ''
}

const useSliderVisibility = (
  currentSlide: number,
  slidesPerPage: number,
  totalItems: number
) => {
  /** Keeps track of slides that have been visualised before.
   * We want to keep rendering them because the issue is mostly rendering
   * slides that might never be viewed; On the other hand, hiding slides
   * that were visible causes visual glitches */
  const visitedSlides = useRef<Set<number>>(new Set())

  useEffect(() => {
    for (let i = 0; i < slidesPerPage; i++) {
      visitedSlides.current.add(currentSlide + i)
    }
  }, [currentSlide, slidesPerPage])

  const isItemVisible = (index: number) =>
    isSlideVisible({
      index,
      currentSlide,
      slidesToShow: slidesPerPage,
      totalItems,
    })

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}

const SliderTrack: FC<Props> = ({ totalItems, infinite }) => {
  const {
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    useSlidingTransitionEffect,
    slideTransition: { speed, timing, delay },
    slides,
    transformMap,
    transform,
  } = useSliderState()
  const dispatch = useSliderDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  const { shouldRenderItem, isItemVisible } = useSliderVisibility(
    currentSlide,
    slidesPerPage,
    totalItems
  )

  const trackWidth =
    slidesPerPage <= totalItems
      ? `${(slides.length * 100) / slidesPerPage}%`
      : '100%'

  return (
    <div
      className={`${handles.sliderTrack} flex justify-around relative pa0 ma0`}
      style={{
        transition:
          isOnTouchMove || !useSlidingTransitionEffect
            ? undefined
            : `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${
          isOnTouchMove ? transform : transformMap[currentSlide]
        }%, 0, 0)`,
        width: trackWidth,
      }}
      onTransitionEnd={() => {
        dispatch({ type: 'DISABLE_TRANSITION' })

        if (currentSlide >= totalItems) {
          dispatch({
            type: 'ADJUST_CURRENT_SLIDE',
            payload: {
              currentSlide: 0,
              transform: transformMap[0],
            },
          })
        }

        if (currentSlide < 0) {
          dispatch({
            type: 'ADJUST_CURRENT_SLIDE',
            payload: {
              currentSlide: totalItems - slidesPerPage,
              transform: transformMap[totalItems - slidesPerPage],
            },
          })
        }
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {slides.map((child: React.ReactNode, index: number) => {
        // This is to take into account that there is a clone of the last page
        // in the left, to enable the infinite loop effect in case infinite
        // is set to true.
        const adjustedIndex = index - (infinite ? slidesPerPage : 0)

        return (
          <div
            key={adjustedIndex}
            {...resolveAriaAttributes(
              isItemVisible(adjustedIndex),
              adjustedIndex,
              totalItems
            )}
            className={`${applyModifiers(
              handles.slide,
              getFirstOrLastVisible(slidesPerPage, adjustedIndex)
            )} flex relative`}
            data-index={
              adjustedIndex >= 0 && adjustedIndex < totalItems
                ? adjustedIndex + 1
                : undefined
            }
            style={{
              width: `${slideWidth}%`,
            }}
          >
            <div
              className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
            >
              {shouldRenderItem(adjustedIndex) ? child : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SliderTrack
