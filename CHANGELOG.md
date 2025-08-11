# Changelog

## [1.5.0] - 2025-08-11

### Added
- Profanity filtering enabled by default for built-in dictionaries with configurable `exclude`, `profanityList`, and `profanityOptions`.
- New styles: `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, and `titleCase`.
- Deterministic generation via `seed` and template-based generation via `template` (e.g. `{adjective}-{noun}-{digits:2}`).
- Batch APIs: `generateMany` and `generateUniqueAsync`.
- CLI enhancements: new primary command `usergen` (aliases: `usernamegen`, `unique-username`, `uuname`), plus `--seed`, `--template`, `--count`, `--unique`, `--out`, `--unsafe`, and `-U/--upper` shortcut.

### Changed
- Cross-platform randomness (crypto when available, Math fallback) for broader runtime compatibility.
- Token sanitization ensures internal punctuation from dictionaries does not leak unless used as a separator.
- `capital` behavior clarified to capitalize only the first character of the overall username; `titleCase` introduced for capitalizing each token.

### Fixed
- generateFromEmail now (by default) strips leading digits from the local-part to avoid usernames starting with numbers; optional via `stripLeadingDigits: false` and configurable `leadingFallback`.
- Addressed reports of inappropriate usernames via the default blocklist and filtering pipeline.

### Issues closed
- Fixed: generateFromEmail not from numbers [#31](https://github.com/subhamg/unique-username-generator/issues/31)
- Fixed: Generates inappropriate usernames [#30](https://github.com/subhamg/unique-username-generator/issues/30)
- Fixed: capitalize option capitalizes only first word [#23](https://github.com/subhamg/unique-username-generator/issues/23)

## [1.1.4] - 2023-07-31

### Changed

- Updated crypto library usage: Replaced `window.crypto` with Node.js `crypto` module for server-side compatibility.

## [1.1.3] - 2022-11-06

### Fixed

- Removal of some explicit words from the two dictionaries
- Fixed a small spelling mistake Retrive -> Retrieve
- Put adjective in first position before noun in generateUsername

**Full Changelog**: https://github.com/subhamg/unique-username-generator/compare/v1.1.1...v1.1.3
