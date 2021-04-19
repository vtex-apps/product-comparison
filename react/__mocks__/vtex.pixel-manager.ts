export const PixelContext = {
  usePixel() {
    return { push: jest.fn() }
  },
}

export const usePixel = () => {
  return { push: jest.fn() }
}
