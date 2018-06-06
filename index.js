var assert = require('nanoassert')
// Control flow
// * A tree always consists of an array
// * break causes the processing of a sub-tree to stop, keeping previous results
// * continue causes the current sub-tree to be skipped
// * drop causes the current processed tree to be removed completely (like calling continue from the top)

function dfs (tree, fn, ctx) {
  assert(Array.isArray(tree), 'tree must be array like')
  assert(typeof fn === 'function', 'fn must be function')

  var res = recurse(tree, ctx, 0, 0)

  // Special root cases
  if (res === dfs.break) return null
  if (res === dfs.continue) return []
  if (res === dfs.drop) return null

  return res

  function recurse(elm, ctx, depth, idx) {
    // Either use an explicit context or use the current element. This is like
    // the 2 argument for Array.map, Array.filter etc.
    var curCtx = ctx || elm

    // If the element is not an array we can return early. Note that this call
    // should be a mirror to the first fn.call inside the loop
    if (!Array.isArray(elm)) return fn.call(curCtx, elm, depth, idx)

    var res = elm.slice()
    for (var i = 0, j = 0, map; i < res.length; i++, j++) {
      map = fn.call(curCtx, res[i], depth, idx)

      if (spread.delete(map)) {
        res.splice(j, 1, ...map)
        i--
        j--
        continue
      }

      if (Array.isArray(map)) map = recurse(map, ctx, depth + 1, 0)
      res[j] = map

      if (map === dfs.continue) j--
      if (map === dfs.break) break
      if (map === dfs.drop) return depth === 0 ? dfs.drop : dfs.continue
    }

    res.length = j // will truncate
    return res
  }
}

dfs.break = Symbol('break')
dfs.continue = Symbol('continue')
dfs.drop = Symbol('drop')

var spread = new WeakSet()
dfs.spread = function (a) {
  if (Array.isArray(a)) spread.add(a)
  return a
}

module.exports = dfs
