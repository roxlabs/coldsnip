# Interface: Snippet

Represents a code snippet extracted from a source file. The field
`permalink` is only present when the source is from a Git repository.

## Table of contents

### Properties

- [content](Snippet.md#content)
- [endLine](Snippet.md#endline)
- [filename](Snippet.md#filename)
- [highlightedLines](Snippet.md#highlightedlines)
- [language](Snippet.md#language)
- [permalink](Snippet.md#permalink)
- [qualifier](Snippet.md#qualifier)
- [sourcePath](Snippet.md#sourcepath)
- [startLine](Snippet.md#startline)

## Properties

### content

• **content**: `string`

The snippet content. Leading spaces are trimmed.

#### Defined in

[types.ts:20](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L20)

___

### endLine

• **endLine**: `number`

The end line of the snippet.

#### Defined in

[types.ts:16](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L16)

___

### filename

• **filename**: `string`

The name of the file, derived from `sourcePath`.

#### Defined in

[types.ts:12](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L12)

___

### highlightedLines

• **highlightedLines**: `number`[]

The lines to be highlighted, if any.

#### Defined in

[types.ts:18](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L18)

___

### language

• **language**: `string`

The source language. It matches the file extension.

#### Defined in

[types.ts:8](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L8)

___

### permalink

• `Optional` **permalink**: `string`

The link to the file on the remote Git repo when available.

#### Defined in

[types.ts:22](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L22)

___

### qualifier

• `Optional` **qualifier**: `string`

An extra qualifier that can be used to differentiate snippets with the same key
that might come from the same file extension.

#### Defined in

[types.ts:27](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L27)

___

### sourcePath

• **sourcePath**: `string`

The file path relative to the working directory.

#### Defined in

[types.ts:10](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L10)

___

### startLine

• **startLine**: `number`

The start line of the snippet.

#### Defined in

[types.ts:14](https://github.com/roxlabs/coldsnip/blob/3c9352e/src/types.ts#L14)
