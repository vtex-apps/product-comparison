import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    totalItems,
    navigationStep,
    transformMap,
  } = useSliderState()
  const dispatch = useSliderDispatch()

  const goBack = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    const nextMaximumSlides = currentSlide - activeNavigationStep

    if (nextMaximumSlides >= 0) {
      /** Have more slides hidden on left */
      nextSlide = nextMaximumSlides
      nextTransformValue = transformMap[nextSlide]
    } else if (nextMaximumSlides < 0 && currentSlide !== 0) {
      /** Prevent overslide */
      nextSlide = 0
      nextTransformValue = 0
    } else if (infinite) {
      nextSlide = nextMaximumSlides
      nextTransformValue = transformMap[nextSlide]
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextTransformValue,
        currentSlide: nextSlide,
      },
    })
  }

  const goForward = (step?: number) => {
    let nextSlide = 0
    let nextTransformValue = 0
    const activeNavigationStep = step ?? navigationStep

    const nextMaximumSlides =
      currentSlide + 1 + slidesPerPage + activeNavigationStep

    if (nextMaximumSlides <= totalItems) {
      /** Have more slides hidden on right */
      nextSlide = currentSlide + activeNavigationStep
      nextTransformValue = transformMap[nextSlide]
    } else if (
      nextMaximumSlides > totalItems &&
      currentSlide !== totalItems - slidesPerPage
    ) {
      /** Prevent overslide */
      nextSlide = totalItems - slidesPerPage
      nextTransformValue = transformMap[nextSlide]
    } else if (infinite) {
      nextSlide = currentSlide + activeNavigationStep
      nextTransformValue = transformMap[nextSlide]
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextTransformValue,
        currentSlide: nextSlide,
      },
    })
  }

  return { goForward, goBack }
}
