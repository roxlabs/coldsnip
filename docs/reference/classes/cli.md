# Class: cli

## Hierarchy

- `default`

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

node_modules/@oclif/command/lib/command.d.ts:49

## Properties

### description

▪ `Static` **description**: `string` = `"describe the command here"`

#### Overrides

Command.description

#### Defined in

[src/cli/index.ts:8](https://github.com/roxlabs/snippetfy/blob/2c82c35/src/cli/index.ts#L8)

___

### flags

▪ `Static` **flags**: `Input`<`any`\>

#### Overrides

Command.flags

#### Defined in

[src/cli/index.ts:10](https://github.com/roxlabs/snippetfy/blob/2c82c35/src/cli/index.ts#L10)

## Methods

### run

▸ **run**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Command.run

#### Defined in

[src/cli/index.ts:42](https://github.com/roxlabs/snippetfy/blob/2c82c35/src/cli/index.ts#L42)
