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

### 5. Add route for the product comparison page
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

# Features and Blocks
This application has few blocks that we can use to configure full feature.

Block | Description
------------ | -------------
`comparison-context-wrapper` | This block contains `product comparison context` which will hold comparison item information
`product-comparison` | This is the main component of comparison page which wraps `comparison-context-wrapper` 
`product-comparison-block` | This is the generic child component which will extend to develop other feature blocks
`product-comparison-block.selector` | This is the product selector checkbox which we can use inside product summary
`product-comparison-block.drawer` | This is product comparison bucket which is placed bottom of the page
`product-comparison-block.list` | This is product comparison page content, this block allows `product-summary` block and `product-comparison-block`
`product-comparison-block.grid` | This is comparison comparison fields as grid (you will be able to show and hide fields)


# Custom configurations in blocks level

These are the `props` that are allowed inside blocks for customize this feature through `site-editor` section.

  * ### `product-comparison-block.grid`
  
    Prop | Description
    ------------ | -------------
    productFieldsToHide | Comma separated list of product fields that needs to be hidden in product comparison grid
    skuFieldsToHide | Comma separated list of sku fields that needs to be hidden in product comparison grid
    productSpecificationsToHide | Comma separated list of product specifications that needs to be hidden in product comparison grid
    skuSpecificationsToHide | Comma separated list of sku specifications that needs to be hidden in product comparison grid
    
    * ###### Available product fields
      Field Name | Display Name | Description
      ------------ | ------------- | -------------
      `productName` | `Pdoduct Name` | Name of the product
      `brand` | `Brand` | Brand Name of the product
      `description` | `Description` | Product description
      `productReference` | `Product Reference` | Product Reference Number
      `name` | 'Sku Name' | Name of the sku
      `ean` | `Ean` | EAN of the Sku
      
    * ###### Available sku fields
      Field Name | Display Name | Description
      ------------ | ------------- | -------------
      `name` | 'Sku Name' | Name of the sku
      `ean` | `Ean` | EAN of the Sku



# Customization
In order to apply CSS customization in this and other blocks, follow the instructions given in the recipe on Using CSS Handles for store customization.

CSS handles |
------------ |
drawerContainer |
drawer |
productThumbnail |
thumbnailContentContainer |
drawerImage |
comparisonButtons |
closeButton |
compareProductsButton |
productSummaryRow |
comparisonNameCol |
comparisonProductCol |
productComparisonGrid | 
productSpecifications |
skuSpecifications |
