# Interface: GitRepo

Represents a Git repository and a matching pattern/glob for files.

**`See`**

LocalPath

## Table of contents

### Properties

- [branch](GitRepo.md#branch)
- [pattern](GitRepo.md#pattern)
- [pull](GitRepo.md#pull)
- [url](GitRepo.md#url)
- [workingDir](GitRepo.md#workingdir)

## Properties

### branch

• `Optional` **branch**: `string`

An optional branch name.

**`Default`**

```ts
"main"
```

#### Defined in

[types.ts:64](https://github.com/roxlabs/coldsnip/blob/8db7009/src/types.ts#L64)

___

### pattern

• **pattern**: `string`

The file pattern / glob to match.

#### Defined in

[types.ts:54](https://github.com/roxlabs/coldsnip/blob/8db7009/src/types.ts#L54)

___

### pull

• `Optional` **pull**: `boolean`

Should pull the latest changes? (merge from origin)

**`Default`**

```ts
false
```

#### Defined in

[types.ts:59](https://github.com/roxlabs/coldsnip/blob/8db7009/src/types.ts#L59)

___

### url

• **url**: `string`

The remote Git repository URL.

#### Defined in

[types.ts:52](https://github.com/roxlabs/coldsnip/blob/8db7009/src/types.ts#L52)

___

### workingDir

• `Optional` **workingDir**: `string`

The directory where the repo should be cloned to.

**`Default`**

```ts
"$TMP/$repoName/$branch"
```

#### Defined in

[types.ts:69](https://github.com/roxlabs/coldsnip/blob/8db7009/src/types.ts#L69)
