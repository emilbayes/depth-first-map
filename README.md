# `depth-first-map`

> Map a tree of arrays in pre-order depth-first

## Usage

```js
var dfs = require('depth-first-map')

// Numbers refer to the order in which fn touches the elements
var tree = [
  0,
  1,
  // outer array: 2, inner array: 4
  [3, [5]],
  6
]

dfs(tree, x => x)
```

## API

### `var newTree = dfs(tree, fn, context)`

Map `tree` to `newTree` calling  `fn(subtree, depth, index)`, where
context (`this`) will be to the current subtree, unless defined in which case it
will stay constant through out the traversal. Please review the following
control flow symbols as well for more powerful mapping possibilities.

### `return dfs.continue`

Skip the current element, but continue processing siblings

### `return dfs.break`

Break out of processing the current element, preserving previously `map`ed
siblings.

### `return dfs.drop`

Drop the current subtree and return back to processing parent.
Previously `map`ed siblings will also be dropped.

### `return dfs.spread(elms)`

Return an array of new elements to be spliced into position of the current
subtree / leaf. The next iteration will process the first element of the
`spread` elements:

```js
dfs([5], x => x > 1 ? dfs.spread([1, x - 1]) : 1) // => [1, 1, 1, 1, 1]
/*
[5] => [1, 4] => [1, 1, 3] => [1, 1, 1, 2] => [1, 1, 1, 1, 1]
 */
```

## Install

```sh
npm install depth-first-map
```

## License

[ISC](LICENSE)
