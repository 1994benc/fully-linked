# Changelog

## [Unreleased]
### Fixed
- globalNodeProps not passed into nodes

## [2.0.1] - 2022-01-02
### Fixed
- Update readme with the new type `ProcessedNode`

## [2.0.0] - 2022-01-02
### Added
- Introduce GlobalNodeProps in `FullyLinkedOptions`, which comes with a new generic type
- Rename InternalNode to ProcessedNode to reflect the fact that it is a node processed by FullyLinked
## [1.0.61] - 2022-01-01
### Added
- Add 'isRoot' property to all nodes to indicate whether they are root nodes

## [1.0.60] - 2021-12-31
### Removed
- Removed xUnadjustedByZoom and yUnadjustedByZoom as not needed

## [1.0.59] - 2021-12-31

### Added
- Add xUnadjustedByZoom and yUnadjustedByZoom to the InternalNode type so that user can use them to save the positions of the nodes and restore the positions in a new graph instance by setting the FullyLink option `initialCamera`
## [1.0.58] - 2021-12-31
### Fixed
- Refactored how initial zoom and pan is set so that is is more readible.
## [1.0.57] - 2021-12-31
### Added
- Ability to add initial canvas zoom and transform
- Canvas zoom and transform events

## [1.0.56] - 2021-12-30
### Fixed
- Fix release issue

## [1.0.53] - 2021-12-30

### Fixed
- Node drag end event should not be emitted many times


## [1.0.52] - 2021-12-30

### Added
- Update readme to include events
## [1.0.51] - 2021-12-30
### Added
- Initial FullyLinked events
- Add pino logger library

## [1.0.49] - 2021-12-30 - 2021-12-30

### Added
- test .npmignore file
- add .npmignore file and then removed it

## [1.0.48] - 2021-12-30

### Added

- Keep-a-changelog plugin added.

## [1.0.47] - 2021-01-08
### Added

- Add test for diffItems 38d3943
- Enable auto-changelog 6d742af
