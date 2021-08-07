# snippetfy - v0.7.0

## Table of contents

### Interfaces

- [GitRepo](interfaces/GitRepo.md)
- [LocalPath](interfaces/LocalPath.md)
- [Snippet](interfaces/Snippet.md)

### Type aliases

- [Snippets](index.md#snippets)
- [SourcePath](index.md#sourcepath)

### Functions

- [extractSnippets](index.md#extractsnippets)

## Type aliases

### Snippets

Ƭ **Snippets**: `Object`

A map between a `key` and a collection of [Snippet](interfaces/Snippet.md) represented by it.
Different snippets can be identified by the same key, which is the case in projects
with support to multiple languages that want to provide samples of the same API in
each supported language.

#### Index signature

▪ [key: `string`]: [`Snippet`](interfaces/Snippet.md)[]

#### Defined in

[types.ts:31](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L31)

___

### SourcePath

Ƭ **SourcePath**: [`LocalPath`](interfaces/LocalPath.md) \| [`GitRepo`](interfaces/GitRepo.md)

A union between [LocalPath](interfaces/LocalPath.md) and [GitRepo](interfaces/GitRepo.md) and serves as the main
entry point of the library.

#### Defined in

[types.ts:69](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L69)

## Functions

### extractSnippets

▸ **extractSnippets**(`sources`): `Promise`<[`Snippets`](index.md#snippets)\>

The main function of the library. It takes a list of [SourcePath](index.md#sourcepath) that represents
local directories or Git repositories where source files containing tagged code snippets
will be parsed and extracted into an indexed data structure (represented by [Snippets](index.md#snippets)).

```js
const snippets = await extractSnippets([
  { path: "~/dev/projects/local", pattern: "*.js" },
  { url: "https://github.com/roxlabs/snippetfy", pattern: "*.ts" },
]);
```

**`name`** extractSnippets

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sources` | [`SourcePath`](index.md#sourcepath)[] | a collection of local or remote (_i.e._ Git) sources. |

#### Returns

`Promise`<[`Snippets`](index.md#snippets)\>

an object indexed by a key, representing the snippet identifier and an array of one
or more code snippets.

#### Defined in

[extractSnippets.ts:131](https://github.com/roxlabs/snippetfy/blob/a37309d/src/extractSnippets.ts#L131)
