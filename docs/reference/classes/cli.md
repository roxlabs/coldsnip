# Class: cli

## Hierarchy

- `Command`

  ↳ **`cli`**

## Table of contents

### Constructors

- [constructor](cli.md#constructor)

### Properties

- [description](cli.md#description)
- [flags](cli.md#flags)

### Methods

- [run](cli.md#run)

## Constructors

### constructor

• **new cli**(`argv`, `config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |
| `config` | `Config` |

#### Inherited from

Command.constructor

#### Defined in

node_modules/@oclif/core/lib/command.d.ts:93

## Properties

### description

▪ `Static` **description**: `string` = `"Extract source code snippets from files"`

#### Overrides

Command.description

#### Defined in

[src/cli/index.ts:7](https://github.com/roxlabs/snippetfy/blob/663a161/src/cli/index.ts#L7)

___

### flags

▪ `Static` **flags**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | `OptionFlag`<`string`, `CustomOptions`\> |
| `format` | `OptionFlag`<`string`, `CustomOptions`\> |
| `help` | `BooleanFlag`<`void`\> |
| `out` | `OptionFlag`<`string`, `CustomOptions`\> |
| `pattern` | `OptionFlag`<`undefined` \| `string`, `CustomOptions`\> |
| `source` | `OptionFlag`<`undefined` \| `string`, `CustomOptions`\> |
| `version` | `BooleanFlag`<`void`\> |

#### Overrides

Command.flags

#### Defined in

[src/cli/index.ts:9](https://github.com/roxlabs/snippetfy/blob/663a161/src/cli/index.ts#L9)

## Methods

### run

▸ **run**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Command.run

#### Defined in

[src/cli/index.ts:42](https://github.com/roxlabs/snippetfy/blob/663a161/src/cli/index.ts#L42)
