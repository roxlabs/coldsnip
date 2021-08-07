# Interface: GitRepo

Represents a Git repository and a matching pattern/glob for files.

**`see`** LocalPath

## Table of contents

### Properties

- [branch](GitRepo.md#branch)
- [pattern](GitRepo.md#pattern)
- [url](GitRepo.md#url)
- [workingDir](GitRepo.md#workingdir)

## Properties

### branch

• `Optional` **branch**: `string`

An optional branch name.

**`default`** "main"

#### Defined in

[types.ts:57](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L57)

___

### pattern

• **pattern**: `string`

The file pattern / glob to match.

#### Defined in

[types.ts:52](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L52)

___

### url

• **url**: `string`

The remote Git repository URL.

#### Defined in

[types.ts:50](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L50)

___

### workingDir

• `Optional` **workingDir**: `string`

The directory where the repo should be cloned to.

**`default`** "$TMP/repoName/branch"

#### Defined in

[types.ts:62](https://github.com/roxlabs/snippetfy/blob/a37309d/src/types.ts#L62)
