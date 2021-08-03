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

#### Defined in

[types.ts:14](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L14)

___

### endLine

• **endLine**: `number`

The end line of the snippet.

#### Defined in

[types.ts:13](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L13)

___

### language

• **language**: `string`

The source language. It matches the file extension.

#### Defined in

[types.ts:7](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L7)

___

### permalink

• `Optional` **permalink**: `string`

#### Defined in

[types.ts:15](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L15)

___

### qualifier

• `Optional` **qualifier**: `string`

#### Defined in

[types.ts:16](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L16)

___

### sourcePath

• **sourcePath**: `string`

The file path relative to the working directory.

#### Defined in

[types.ts:9](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L9)

___

### startLine

• **startLine**: `number`

The start line of the snippet.

#### Defined in

[types.ts:11](https://github.com/roxlabs/snippetfy/blob/e44e5f1/src/types.ts#L11)
