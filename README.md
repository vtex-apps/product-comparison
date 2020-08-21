# Product Comparison

VTEX Product Comparison app is responsible for collecting products (with selected SKU) and give comparison view to compare features and specifications of the product, so user can get better understanding about their needs.

The app therefore exports few store blocks expected to configure full functionality, such as `sku selector`, `comparison drawer` and `comparison list` views.

![Comparison drawer](https://user-images.githubusercontent.com/2637457/90900569-43a41a00-e3e7-11ea-9aa9-9a12bbec8c5e.png)
![image](https://user-images.githubusercontent.com/2637457/90900828-a1386680-e3e7-11ea-96d1-e9ba2022aa7d.png)


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

# Configuration

### 1. Add `Product Comparison` app to store theme

```
"dependencies": {
  ...
  "vtex.product-comparison": "0.x"
  ...
}
```

### 2. Extend required interfaces to add new functionality

Add product comparison to search results page we need to do some configurations on existing blocks in `store-theme` applications. Therefore we need to extend few exising interfaces.

  * #### Interfaces needds to extend
    We need to extend `store.search`,  `product-summary.shelf` and `search-result-layout.desktop` blocks in `store-theme`
    
      1. Add `interfaces.json` file if not exist in `store-theme`
      2. Add this configurations inside `interfaces.json`
       
         ```
          "store.search.product-comparison": {
            "around": ["comparison-context-wrapper"]
          },
          "product-summary.shelf.product-comparison": {
            "allowed": ["product-comparison-block"]
          },
          "search-result-layout.desktop.product-comparison": {
            "allowed": ["product-comparison-block"]
          }
          ```
  * #### Replace old blocks with new extended blocks
    Replace all the places we have used old blocks with new extended blocks like below.

  1. Replace `store.search`
    
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
          ...
          etc.
        ```
      
   2. Continue same thing with other tow blocks (`product-summary.shelf` and `search-result-layout.desktop`)
    

### 3. Add product comparison selector and comparison drawer to search result page

  1. Add comparison drawer
  
      `product-comparison-block.drawer` block needs to be added inside extended `search-result-layout.desktop.product-comparison` to display comparison drawer

        ```diff
          "search-result-layout.desktop.product-comparison#search": {
            "children": [
              "flex-layout.row#searchbread",
              "flex-layout.row#searchtitle",
              "flex-layout.row#result"
        +     "product-comparison-block.drawer"
            ],
            ...
          },
        ```
  2. Add product selector checkbox
  
      `product-comparison-block.selector` block needs to be added inside extended `product-summary.product-comparison` to product selector checkbox
  
        ```diff
          "product-summary.shelf.product-comparison#search": {
            "children": [
              "product-summary-image",
              "product-summary-name",
              "product-summary-attachment-list",
              "product-summary-space",
              "product-summary-column#1",
        +      "product-comparison-block.selector"
            ]
          }
        ```

### 3. Configure comparison detail page

  1. Add product comparison page blocks
  
      Add this custom page blocks in appropriate location (create `<custom-page>.json` inside `/store/blocks` folder). 

        ```diff
        "store.custom#product-comparison-list": {
          "children": [
            "product-comparison#comparison-list"
          ]
        },
        "product-comparison#comparison-list": {
          "blocks": ["product-comparison-block.list#compare"]
        },
        "product-comparison-block.list#compare": {
          "blocks": [
            "product-summary.shelf.product-comparison#search",
            "product-comparison-block.grid"
          ]
        },
        ```
  2. Add custom page routes in `routes.json` inside `/store/blocks`
  
      ```
      "store.custom#product-comparison-list": {
        "path": "/product-comparison"
      }
      ```

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
