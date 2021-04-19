/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: productsByIdentifier
// ====================================================

export interface productsByIdentifier_productsByIdentifier_categoryTree {
  /**
   *  Category name
   */
  name: string | null
  /**
   *  URI of category
   */
  href: string | null
}

export interface productsByIdentifier_productsByIdentifier_items_referenceId {
  Value: string | null
}

export interface productsByIdentifier_productsByIdentifier_items_images {
  imageUrl: string | null
  imageTag: string | null
}

export interface productsByIdentifier_productsByIdentifier_items_sellers_commertialOffer_Installments {
  Value: number | null
  InterestRate: number | null
  TotalValuePlusInterestRate: number | null
  NumberOfInstallments: number | null
  Name: string | null
}

export interface productsByIdentifier_productsByIdentifier_items_sellers_commertialOffer {
  Installments:
    | (productsByIdentifier_productsByIdentifier_items_sellers_commertialOffer_Installments | null)[]
    | null
  AvailableQuantity: number | null
  Price: number | null
  ListPrice: number | null
}

export interface productsByIdentifier_productsByIdentifier_items_sellers {
  sellerId: string | null
  commertialOffer: productsByIdentifier_productsByIdentifier_items_sellers_commertialOffer | null
}

export interface productsByIdentifier_productsByIdentifier_items {
  name: string | null
  itemId: string | null
  referenceId:
    | (productsByIdentifier_productsByIdentifier_items_referenceId | null)[]
    | null
  images:
    | (productsByIdentifier_productsByIdentifier_items_images | null)[]
    | null
  sellers:
    | (productsByIdentifier_productsByIdentifier_items_sellers | null)[]
    | null
}

export interface productsByIdentifier_productsByIdentifier_productClusters {
  id: string | null
  name: string | null
}

export interface productsByIdentifier_productsByIdentifier {
  /**
   *  linkText is used as cacheId
   */
  cacheId: string | null
  /**
   *  Product ID
   */
  productId: string | null
  /**
   *  Product name
   */
  productName: string | null
  /**
   *  Product description
   */
  description: string | null
  /**
   *  Categories of the product
   */
  categories: (string | null)[] | null
  /**
   *  Product's categories
   */
  categoryTree:
    | (productsByIdentifier_productsByIdentifier_categoryTree | null)[]
    | null
  /**
   *  Product URL
   */
  link: string | null
  /**
   *  Product slug
   */
  linkText: string | null
  /**
   *  Brand of the product
   */
  brand: string | null
  /**
   *  SKU objects of the product
   */
  items: (productsByIdentifier_productsByIdentifier_items | null)[] | null
  productClusters:
    | (productsByIdentifier_productsByIdentifier_productClusters | null)[]
    | null
}

export interface productsByIdentifier {
  productsByIdentifier:
    | (productsByIdentifier_productsByIdentifier | null)[]
    | null
}

export interface productsByIdentifierVariables {
  ids?: string[] | null
}
