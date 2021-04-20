import { pathOr, find, propEq } from 'ramda'

export const DEFAULT_WIDTH = 'auto'
export const DEFAULT_HEIGHT = 'auto'
export const MAX_WIDTH = 3000
export const MAX_HEIGHT = 4000

/**
 * Having the url below as base for the LEGACY file manager,
 * https://storecomponents.vteximg.com.br/arquivos/ids/155472/Frame-3.jpg?v=636793763985400000
 * the following regex will match https://storecomponents.vteximg.com.br/arquivos/ids/155472
 *
 * Also matches urls with defined sizes like:
 * https://storecomponents.vteximg.com.br/arquivos/ids/155473-160-auto
 * @type {RegExp}
 *
 * On the new vtex.file-manager isn't necessary replace the URL, just add the param on the querystring, like:
 * "?width=WIDTH&height=HEIGHT&aspect=true"
 *
 */
const baseUrlRegex = new RegExp(/.+ids\/(\d+)/)

const httpRegex = new RegExp(/http:\/\//)

const toHttps = (url: string) => {
  return url.replace(httpRegex, 'https://')
}

const cleanImageUrl = (imageUrl: string) => {
  const result = baseUrlRegex.exec(imageUrl)

  return result && result.length > 0 ? result[0] : ''
}

const replaceLegacyFileManagerUrl = (
  imageUrl: string,
  width: number | string,
  height: number | string
) => {
  const legacyUrlPattern = '/arquivos/ids/'
  const isLegacyUrl = imageUrl.includes(legacyUrlPattern)

  if (!isLegacyUrl) return imageUrl

  return `${cleanImageUrl(imageUrl)}-${width}-${height}`
}

export function changeImageUrlSize(
  imageUrl: string,
  width: number | string = DEFAULT_WIDTH,
  height: number | string = DEFAULT_HEIGHT
) {
  if (!imageUrl) return
  typeof width === 'number' && (width = Math.min(width, MAX_WIDTH))
  typeof height === 'number' && (height = Math.min(height, MAX_HEIGHT))

  const normalizedImageUrl = replaceLegacyFileManagerUrl(
    imageUrl,
    width,
    height
  )

  const queryStringSeparator = normalizedImageUrl.includes('?') ? '&' : '?'

  return `${normalizedImageUrl}${queryStringSeparator}width=${width}&height=${height}&aspect=true`
}

const defaultImage = { imageUrl: '', imageLabel: '' }
const defaultReference = { Value: '' }
const defaultSeller = { commertialOffer: { Price: 0, ListPrice: 0 } }

const resizeImage = (url: string, imageSize: number) =>
  changeImageUrlSize(toHttps(url), imageSize)

export const mapCatalogProductToProductSummary = (
  product: Product,
  skuId: string,
  imageSize = 500
) => {
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  if (!product) return {} as Product
  const normalizedProduct = { ...product }
  const items = normalizedProduct.items || []
  const sku = find(propEq('itemId', skuId))(items)

  if (sku) {
    const [seller = defaultSeller] = pathOr([], ['sellers'], sku)
    const [referenceId = defaultReference] = pathOr([], ['referenceId'], sku)
    const catalogImages: SkuImage[] = pathOr([], ['images'], sku)
    const normalizedImages = catalogImages.map((image) => ({
      ...image,
      imageUrl: resizeImage(image.imageUrl, imageSize),
    }))

    const [image = defaultImage] = normalizedImages

    normalizedProduct.sku = {
      ...sku,
      seller,
      referenceId,
      image,
      images: normalizedImages,
    }
  }

  return normalizedProduct
}
