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
| `config` | `IConfig` |

#### Inherited from

Command.constructor

#### Defined in

node_modules/@oclif/command/lib/command.d.ts:48

## Properties

### description

▪ `Static` **description**: `string` = `"describe the command here"`

#### Overrides

Command.description

#### Defined in

[src/cli/index.ts:7](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/cli/index.ts#L7)

___

### flags

▪ `Static` **flags**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | `IOptionFlag`<`undefined` \| `string`\> |
| `format` | `IOptionFlag`<`OutputFormat`\> |
| `help` | `IBooleanFlag`<`void`\> |
| `out` | `IOptionFlag`<`string`\> |
| `pattern` | `IOptionFlag`<`undefined` \| `string`\> |
| `source` | `IOptionFlag`<`undefined` \| `string`\> |
| `version` | `IBooleanFlag`<`void`\> |

#### Overrides

Command.flags

#### Defined in

[src/cli/index.ts:9](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/cli/index.ts#L9)

## Methods

### run

▸ **run**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Command.run

#### Defined in

[src/cli/index.ts:41](https://github.com/roxlabs/snippetfy/blob/c7fdbf3/src/cli/index.ts#L41)
