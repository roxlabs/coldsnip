# Interface: Snippet

Represents a code snippet extracted from a source file. The field
`permalink` is only present when the source is from a Git repository.

## Table of contents

### Properties

- [content](Snippet.md#content)
- [endLine](Snippet.md#endline)
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

[types.ts:16](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L16)

___

### endLine

• **endLine**: `number`

The end line of the snippet.

#### Defined in

[types.ts:14](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L14)

___

### language

• **language**: `string`

The source language. It matches the file extension.

#### Defined in

[types.ts:8](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L8)

___

### permalink

• `Optional` **permalink**: `string`

The link to the file on the remote Git repo when available.

#### Defined in

[types.ts:18](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L18)

___

### qualifier

• `Optional` **qualifier**: `string`

An extra qualifier that can be used to differentiate snippets with the same key
that might come from the same file extension.

#### Defined in

[types.ts:23](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L23)

___

### sourcePath

• **sourcePath**: `string`

The file path relative to the working directory.

#### Defined in

[types.ts:10](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L10)

___

### startLine

• **startLine**: `number`

The start line of the snippet.

#### Defined in

[types.ts:12](https://github.com/roxlabs/coldsnip/blob/3e3785d/src/types.ts#L12)
