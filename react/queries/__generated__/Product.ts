/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductUniqueIdentifier } from './../../graphQLTypes'

// ====================================================
// GraphQL query operation: Product
// ====================================================

export interface Product_product_categoryTree {
  /**
   *  Category ID
   */
  id: number | null
  /**
   *  Category name
   */
  name: string | null
  /**
   *  URI of category
   */
  href: string | null
}

export interface Product_product_items_images {
  imageId: string | null
  imageLabel: string | null
  imageUrl: string | null
  imageText: string | null
}

export interface Product_product_items {
  itemId: string | null
  name: string | null
  nameComplete: string | null
  images: (Product_product_items_images | null)[] | null
}

export interface Product_product {
  /**
   *  linkText is used as cacheId
   */
  cacheId: string | null
  /**
   *  Product name
   */
  productName: string | null
  /**
   *  Product ID
   */
  productId: string | null
  /**
   *  Product's categories
   */
  categoryTree: (Product_product_categoryTree | null)[] | null
  /**
   *  SKU objects of the product
   */
  items: (Product_product_items | null)[] | null
}

export interface Product {
  /**
   * Returns a specified product
   */
  product: Product_product | null
}

export interface ProductVariables {
  slug?: string | null
  identifier?: ProductUniqueIdentifier | null
  skipCategoryTree?: boolean | null
}
