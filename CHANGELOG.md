# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Implemented loading behaviour for products comparison page.

### Changed
- Limit comparison bucket size and given it as app configuration parameter
- Enhance product comparison context to add array of items at once 
- Show notifications when comparison bucket is full

## [0.5.0] - 2020-11-19

## [0.4.0] - 2020-11-10

### Added
- CSS Handles:
  - `removeAllItemsButtonWrapper`
  - `compareProductButtonWrapper`
  - `removeAllWrapper`
  - `hideOrShowText`
  
## [0.3.0] - 2020-11-06

### Added

- `docs` builder to manifest

## [0.2.1] - 2020-11-03

### Added
- Condition for comparing products based on the category tree of the first product selected for comparison, this condition renders the checkbox unclickable for products that do not match the category of the first selected product.

## [0.2.0] - 2020-10-08


## [0.1.0] - 2020-09-29

### Changed

- Change vendor name and application name

### Added

- Added product specification groups for comparison

### Fixed

- fix requested ui issues
- fix slider refresh issue

### Removed

- remove unused files in product comparison grid

### Changed

- drawer product summary styling
- rename translation key
- Rename `type` to `fieldType` in comparison field
- Product comparison hide fields

### Added

- Product comparison grid basic feature
- Comparison list normalize product for product summary

### Fixed

- Fix ui switch change in comparison drawer

### Changed

- use promise all to get all products at once in product comparison page
- use product query to get product details
- Change back to comparison check box
- Added style changes to comparison drawer

### Added

- Added product comparison basic functionalities
- Add changelog
- Product comparison page basic functionality
