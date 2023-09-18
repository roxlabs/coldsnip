# Snippet syntax

Coldsnip allows you to mark sections of your codebase for extraction into isolated code snippets. In this page  you will find out how to mark your source code and use all supported features, such as line highlights.

## Basic Syntax

The library uses special comments within your code to identify the start and end of code snippets, as well as lines to be highlighted. The basic tags you'll use are:

- `@snippet:start`: Marks the start of a new snippet.
- `@snippet:end`: Marks the end of a snippet.
- `@highlight`: Highlights a single line within a snippet.
- `@highlight:start` and `@highlight:end`: Marks a block of lines to be highlighted.

### The `@snippet:start` tag

You can also pass arguments in the start tag for more control:

- `@snippet:start(id)`: Here, `id` is a string argument specifying the snippet's identifier.

## How to Use

### Simple Code Snippets

To mark a section of your code as a snippet:

```js
// @snippet:start("hello")
const hello = "Hello, world!";
console.log(hello);
// @snippet:end
```

### Highlight lines

You can export which lines should be highlighted in your code snippet. It works for single lines:

```js
// @snippet:start
const hello = "Hello, world!";
console.log(hello, "This line is highlighted"); // @highlight
// @snippet:end
```

Or for line ranges:

```js
// @snippet:start
const hello = "Hello, world!";
// @highlight:start
console.log("This line is highlighted.");
console.log("This line is also highlighted.");
// @highlight:end
// @snippet:end
```

**Note:** the `@highlight` tags will not be present in your code snippet content.

## Advanced Usage

### Snippets with qualifiers

Sometimes you need to have multiple snippets of the same language but using different libraries or frameworks. For example, you may want to show how to use a library with promises and with async/await. In this case, you can use qualifiers to differentiate between the two snippets:

**Promises:**

```js
// @snippet:start("hello", qualifier: "promises")
hello()
  .then(console.log("world"))
  .catch(console.error);
// @snippet:end
```

**Async/Await:**

```js
// @snippet:start("hello", qualifier: "async/await")
try {
  await hello();
  console.log("world");
} catch (error) {
  console.error(error);
}
// @snippet:end
```

By sharing the same `"hello"` id, but with different qualifiers, the snippets will be grouped together, allowing the consuming API/Documentation to display them together.

## Error Handling

The library keeps things lightweight and **it's not a fully-fledged parser**. However, it does perform some basic error checking to ensure that the syntax is correct. The following errors will be detected:

1. A `@highlight` or `@highlight:start` tag is found outside a snippet.
2. A `@highlight:end` tag is found without a corresponding `@highlight:start` tag.
3. A snippet is not closed with a `@snippet:end` tag.

In case you find a bug or some unhandled edge case, please [open an issue](https://github.com/roxlabs/coldsnip/issues/new) on GitHub.
