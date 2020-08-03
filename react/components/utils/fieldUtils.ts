import { split, trim, without } from 'ramda'

export const splitString = (text?: string) => {
  if (!(text && text.length > 0)) {
    return []
  }

  return split(',', text)
    .filter(str => str !== null && str !== '')
    .map(str => trim(str))
}

export const getProductSpecificationFields = (
  existing: string[],
  fieldsToHide?: string
) => {
  const removeList = splitString(fieldsToHide)
  return without(removeList, existing)
}

export const getSkuSpecificationFields = (
  existing: string[],
  fieldsToHide?: string
) => {
  const removeList = splitString(fieldsToHide)
  return without(removeList, existing)
}

export const getProductFields = (fieldsToHide?: string) => {
  const fieldNames = ['productName', 'brand', 'description', 'productReference']
  const removeList = splitString(fieldsToHide)
  const fieldsSelected = without(removeList, fieldNames)

  const fields = fieldsSelected.map(fieldName => {
    let value = {}

    switch (fieldName) {
      case 'productName':
        value = {
          type: 'ProductField',
          name: 'productName',
          displayValue: 'Product Name',
          showOnSite: true,
        }
        break
      case 'brand':
        value = {
          type: 'ProductField',
          name: 'brand',
          displayValue: 'Brand',
          showOnSite: true,
        }
        break
      case 'description':
        value = {
          type: 'ProductField',
          name: 'description',
          displayValue: 'Product Description',
          showOnSite: true,
        }
        break
      case 'productReference':
        value = {
          type: 'ProductField',
          name: 'productReference',
          displayValue: 'Product Reference',
          showOnSite: true,
        }
        break
      default:
        value = {
          type: '',
          name: '',
          displayValue: '',
          showOnSite: false,
        }
        break
    }
    return value as ComparisonField
  })

  return fields
}

export const getSkuFields = (fieldsToHide?: string) => {
  const fieldNames = ['name', 'ean']
  const removeList = splitString(fieldsToHide)
  const fieldsSelected = without(removeList, fieldNames)

  const fields = fieldsSelected.map(fieldName => {
    let value = {}
    switch (fieldName) {
      case 'name':
        value = {
          type: 'ProductField',
          name: 'productName',
          displayValue: 'Product Name',
          showOnSite: true,
        }
        break
      case 'ean':
        value = {
          type: 'ProductField',
          name: 'brand',
          displayValue: 'Brand',
          showOnSite: true,
        }
        break
      default:
        value = {
          type: '',
          name: '',
          displayValue: '',
          showOnSite: false,
        }
        break
    }
    return value as ComparisonField
  })

  return fields
}
