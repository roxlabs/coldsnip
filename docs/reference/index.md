# coldsnip - v0.9.1

## Table of contents

### Interfaces

- [GitRepo](interfaces/GitRepo.md)
- [LocalPath](interfaces/LocalPath.md)
- [Snippet](interfaces/Snippet.md)

### Type Aliases

- [ExtractSnippetOptions](index.md#extractsnippetoptions)
- [LookupOptions](index.md#lookupoptions)
- [Snippets](index.md#snippets)
- [SourcePath](index.md#sourcepath)

### Functions

- [extractSnippets](index.md#extractsnippets)
- [lookupSnippets](index.md#lookupsnippets)

## Type Aliases

### ExtractSnippetOptions

Ƭ **ExtractSnippetOptions**: `Object`

Options to customize the snippet extraction process.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `branch` | `string` | The branch to use when extracting snippets from remote Git repositories. **`Default`** ```ts "main" ``` |

#### Defined in

[types.ts:115](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L115)

___

### LookupOptions

Ƭ **LookupOptions**: `Object`

Snippet lookup options. The `key` is always required, the other properties
are useful for matching multi-language snippets indexed by the same key.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | the snippet identifier |
| `language?` | `string` | the snippet source language |
| `qualifier?` | `string` | the snippet qualifier. Often use to differentiate snippets |

#### Defined in

[lookupSnippet.ts:7](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/lookupSnippet.ts#L7)

___

### Snippets

Ƭ **Snippets**: `Object`

A map between a `key` and a collection of [Snippet](interfaces/Snippet.md) represented by it.
Different snippets can be identified by the same key, which is the case in projects
with support to multiple languages that want to provide samples of the same API in
each supported language.

#### Index signature

▪ [key: `string`]: [`Snippet`](interfaces/Snippet.md)[]

#### Defined in

[types.ts:36](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L36)

___

### SourcePath

Ƭ **SourcePath**: [`LocalPath`](interfaces/LocalPath.md) \| [`GitRepo`](interfaces/GitRepo.md)

A union between [LocalPath](interfaces/LocalPath.md) and [GitRepo](interfaces/GitRepo.md) and serves as the main
entry point of the library.

#### Defined in

[types.ts:80](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L80)

## Functions

### extractSnippets

▸ **extractSnippets**(`sources`, `options?`): `Promise`<[`Snippets`](index.md#snippets)\>

The main function of the library. It takes a list of [SourcePath](index.md#sourcepath) that represents
local directories or Git repositories where source files containing tagged code snippets
will be parsed and extracted into an indexed data structure (represented by [Snippets](index.md#snippets)).

```js
const snippets = await extractSnippets([
  { path: "~/dev/projects/local", pattern: "*.js" },
  { url: "https://github.com/roxlabs/coldsnip", pattern: "*.ts" },
]);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `sources` | [`SourcePath`](index.md#sourcepath)[] | `undefined` | a collection of local or remote (_i.e._ Git) sources. |
| `options` | [`ExtractSnippetOptions`](index.md#extractsnippetoptions) | `DEFAULT_EXTRACT_OPTIONS` | a set of optional parameters to customize the snippet extraction process. |

#### Returns

`Promise`<[`Snippets`](index.md#snippets)\>

an object indexed by a key, representing the snippet identifier and an array of one
or more code snippets.

**`Name`**

extractSnippets

#### Defined in

[extractSnippets.ts:223](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/extractSnippets.ts#L223)

___

### lookupSnippets

▸ **lookupSnippets**(`snippets`, `options`): [`Snippet`](interfaces/Snippet.md) \| `undefined`

Lookup for a specific snippet.

**Implementation note:** in case more than one snippet match the options
the first matched result will be returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `snippets` | [`Snippets`](index.md#snippets) | all extracted snippets |
| `options` | [`LookupOptions`](index.md#lookupoptions) | the lookup options |

#### Returns

[`Snippet`](interfaces/Snippet.md) \| `undefined`

the matching snippet or `undefined` in case it couldn't be found.

#### Defined in

[lookupSnippet.ts:26](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/lookupSnippet.ts#L26)
