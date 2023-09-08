---
title: Getting Started
nav_order: 2
permalink: /getting-started/
has_children: true
---

# Getting started

For most use cases, using the Coldsnip CLI is the easiest way to go. You can also use it programmatically if your goal is to integrate with other systems or create a plugin for your favorite Markdown parser or static site generator.

Let's explore those two options.

## CLI

```
coldsnip --format markdown --out snippets/
```

### Config file

In order to `.coldsnip.js`

```js
module.exports = {
  sources: [
    { path: "", pattern: "" },
    { url: "", pattern: "", branch: "main" }
  ],
  format: "markdown"
};
```
