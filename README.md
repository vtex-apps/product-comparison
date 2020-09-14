# Product Comparison

VTEX Product Comparison app is responsible for selecting products (with selected SKU) and compare specifications of them in a separate view, so user can get better understanding about their needs.

This app provides `store blocks` to configure this feature in your store.

![Comparison drawer](https://user-images.githubusercontent.com/2637457/90900569-43a41a00-e3e7-11ea-9aa9-9a12bbec8c5e.png)
![image](https://user-images.githubusercontent.com/2637457/90900828-a1386680-e3e7-11ea-96d1-e9ba2022aa7d.png)

# Configuration

### 1. Add `Product Comparison` app to store theme

```
"dependencies": {
  ...
  "vtex.product-comparison": "0.x"
  ...
}
```

### 2. Create `interfaces.json` in `store-theme` project if not already exist and put these two extended interfaces

```diff
{
  "store.search.product-comparison": {
    "around": ["comparison-context-wrapper"]
  },
  "search-result-layout.desktop.product-comparison": {
    "allowed": ["product-comparison-drawer"]
  }
}
```

### 3. Replace `store.search` block with `store.search.product-comparison`
`store.search.product-comparison` block wraps `store.search` block with comparison context, so we can reflect selected products in comparison drawer at the same time.

```diff
{
  ...
- "store.search": {
+ "store.search.product-comparison": {
    ...
  },
- "store.search#brand": {
+ "store.search.product-comparison#brand": {
    ...
  },
- "store.search#department": {
+ "store.search.product-comparison#department": {
    ...
  }
- "store.search#category": {
+ "store.search.product-comparison#category": {
    ...
  }
- "store.search#subcategory": {
+ "store.search.product-comparison#subcategory": {
    ...
  }
  ...
  etc.
```

### 4. Replace `search-result-layout.desktop` block with `search-result-layout.desktop.product-comparison` to add comparison drawer to search results page

```diff
{
  ...
"search-result-layout": {
  "blocks": [
-   "search-result-layout.desktop#search"
+   "search-result-layout.desktop.product-comparison#search",
    "search-result-layout.mobile",
    "search-not-found-layout"
  ]
},
...

- "search-result-layout.desktop#search": {
+ "search-result-layout.desktop.product-comparison#search": {
  "children": [
    "flex-layout.row#did-you-mean",
    "flex-layout.row#suggestion",
    "flex-layout.row#banner-one",
    "flex-layout.row#searchbread",
    "flex-layout.row#searchtitle",
    "flex-layout.row#result",
+    "product-comparison-drawer"
  ],
  "props": {
    "pagination": "show-more",
    "preventRouteChange": false,
    "mobileLayout": {
      "mode1": "small",
      "mode2": "normal"
    }
  }
}

```

### 5. Create new blocks json file `product-comparison.json` inside `/store/blocks` folder in `store-theme` and add the content below

```diff
{
  "store.custom#product-comparison-list": {
    "children": [
      "comparison-page"
    ]
  },
  "product-summary.shelf.product-comparison#search": {
    "children": [
      "product-summary-image",
      "product-summary-name",
      "product-summary-attachment-list",
      "product-summary-space",
      "product-summary-column#1",
      "product-comparison-block.selector"
    ]
  }
}

```

### 6. Add route for the product comparison page
Add new route for the product comparison custom page created in step 5. Create `routes.json` if not exist in `store-theme` application and put below content. 

```diff
{
  ...
  "store.custom#product-comparison-list": {
    "path": "/product-comparison"
  }
  ...
}

```

# Features and Interfaces
If you need to customize further, this application exposes below interfaces. Refer `blocks.json` if you need more insight.

Interface | Description
------------ | -------------
`comparison-context-wrapper` | This interface contains `product comparison context` which will hold comparison items
`product-comparison-drawer`| This is product comparison drawer which holds items in product summary view
`list-context.comparison-product-summary-slider` | Product summary list with slider layout
`product-summary.shelf.product-comparison` | Extended product summary block for product comparison features
`product-comparison-block` | This is the generic component which was extended to develop feature blocks
`product-comparison-block.selector` | This is the product selector checkbox for product summary
`product-comparison-block.close-button` | This is the remove button for product summary
`comparison-page` | Product comparison page
`roduct-comparison-block.product-summary-row` : First row of comparison row
`list-context.comparison-row` | This block represents single row in product comparison page
`product-comparison-block.product-summary-row` | Row with product summary lisging
`product-comparison-block.grouped-product-specifications` | Product specifications separating with specification groups
`product-comparison-block.product-specifications` | Product specification section (Not comes with default setup)
`product-comparison-block.sku-specifications` | Sku specification section (Not comes with default setup)

# Custom configurations in blocks level

These are the `props` that are allowed inside blocks for customize this feature through `site-editor` section.

  * ### `product-comparison-block.grouped-product-specifications`
  
    Prop | Description
    ------------ | -------------
    productSpecificationsToHide | Comma separated list of product fields that needs to be hidden in product comparison grid
    productSpecificationGroupsToHide | Comma separated list of product specification groups that needs to be hidden in product comparison grid

  * ### `product-comparison-block.product-specifications`
  
    Prop | Description
    ------------ | -------------
    productSpecificationsToHide | Comma separated list of product fields that needs to be hidden in product comparison grid
        
  * ### `product-comparison-block.sku-specifications`
  
    Prop | Description
    ------------ | -------------
    skuSpecificationsToHide | Comma separated list of sku specifications fields that needs to be hidden in comparison page
        

# Customization
In order to apply CSS customization in this and other blocks, follow the instructions given in the recipe on Using CSS Handles for store customization.

CSS handles |
------------ |
title|
rowContainer|
fieldNameCol|
productFieldValue|
skuFieldValue|
productSpecificationValues|
productSpecificationValue|
skuSpecificationValues|
skuSpecificationValue|
comparisonCol|
productSummaryRowContainer|
fieldNameCol|
showDifferencesContainer|
drawerContainer|
expandCollapseButton|
comparisonButtons|
compareProductsButton|
drawer|
closeButton|
closeButtonContainer|
productSelectorContainer|


