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

[src/types.ts:15](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L15)

___

### endLine

• **endLine**: `number`

The end line of the snippet.

#### Defined in

[src/types.ts:13](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L13)

___

### language

• **language**: `string`

The source language. It matches the file extension.

#### Defined in

[src/types.ts:7](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L7)

___

### permalink

• `Optional` **permalink**: `string`

The link to the file on the remote Git repo when available.

#### Defined in

[src/types.ts:17](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L17)

___

### qualifier

• `Optional` **qualifier**: `string`

An extra qualifier that can be used to differentiate snippets with the same key
that might come from the same file extension.

#### Defined in

[src/types.ts:22](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L22)

___

### sourcePath

• **sourcePath**: `string`

The file path relative to the working directory.

#### Defined in

[src/types.ts:9](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L9)

___

### startLine

• **startLine**: `number`

The start line of the snippet.

#### Defined in

[src/types.ts:11](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/types.ts#L11)
