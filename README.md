# Snippets from actual code

Snippetfy extracts code snippets from codebases to ensure code embeded on documentation, blog posts and books are always *correct* and *up-to-date*. Stop writing code on Markdown and HTML files and focus on working samples.


![NPM](https://img.shields.io/npm/v/@snippetfy/core?style=flat-square)


## About the project

This project was motivated by past experiences dealing with outdated or faulty code samples in documentation, as both an open source maintainer and consumer. As developers, we often make mistakes when writing code directly on Markdown or HTML files. Snippetfy attempts to avoid those mistakes by pulling code snippets tagged in actual source code.

## Getting Started

Snippetfy can be used as a library, as a CLI or through direct integrations with other platforms. Check the [getting started guide](https://roxlabs.github.io/snippetfy/getting-started/) in order to determine the best option for your needs.

### Library

<!--- @snippet:include(readme.lib) --->
```ts
const snippets = await extractSnippets([
  { path: "src/__tests__", pattern: "snippets/twoSnippets.js" },
]);
```

The return type is an map between the key and the snippet information, as detailed bellow:

<!--- @snippet:include(readme.types) --->
```ts
/**
 * Represents a code snippet extracted from a source file. The field
 * `permalink` is only present when the source is from a Git repository.
 */
export interface Snippet {
  /** The source language. It matches the file extension. */
  language: string;
  /** The file path relative to the working directory. */
  sourcePath: string;
  /** The start line of the snippet. */
  startLine: number;
  /** The end line of the snippet. */
  endLine: number;
  /** The snippet content. Leading spaces are trimmed. */
  content: string;
  /** The link to the file on the remote Git repo when available. */
  permalink?: string;
  /**
   * An extra qualifier that can be used to differentiate snippets with the same key
   * that might come from the same file extension.
   */
  qualifier?: string;
}

/**
 * A map between a `key` and a collection of {@link Snippet} represented by it.
 * Different snippets can be identified by the same key, which is the case in projects
 * with support to multiple languages that want to provide samples of the same API in
 * each supported language.
 */
export type Snippets = { [key: string]: Snippet[] };
```

## Roadmap

See the [open feature requests](https://github.com/roxlabs/snippetfy/labels/enhancement) for a list of proposed features and join the discussion.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Make sure you read our [Code of Conduct](https://github.com/roxlabs/snippetfy/blob/main/CODE_OF_CONDUCT.md)
1. Fork the project and clone your fork
1. Setup the local environment with `npm install`
1. Create a feature branch (`git checkout -b feature/AmazingFeature`) or a bugfix branch (`git checkout -b fix/BoringBug`)
1. Commit the changes (`git commit -m 'Some meaningful message'`)
1. Push to the branch (`git push origin feature/AmazingFeature`)
1. Open a Pull Request


## License

Distributed under the MIT License. See [LICENSE](https://github.com/roxlabs/snippetfy/blob/main/LICENSE) for more information.