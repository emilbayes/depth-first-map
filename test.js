var test = require('tape')
var dfs = require('.')

test('identity', function (assert) {
  var expected = [
    0,
    1,
    // outer: 2, inner: 4
    [3, [5]],
    6
  ]

  assert.same(dfs(expected, x => x), expected, 'identity must not modify')
  assert.end()
})

test('simple', function (assert) {
  assert.same(dfs([], _ => assert.fail('unreachable')), [], 'empty tree')
  assert.same(dfs([1, 2, 3], _ => dfs.break), [], 'break on root element causes empty tree')
  assert.same(dfs([1, 2, 3], n => n > 2 ? dfs.break : n), [1, 2], 'break causes early return')
  assert.same(dfs([1, 2, 3], n => n === 2 ? dfs.continue : n), [1, 3], 'continue skips element')
  assert.same(dfs([1, 2, 3], _ => dfs.drop), null, 'drop on root element returns null')
  assert.same(dfs([1, 2, 3], _ => dfs.continue), [], 'continue on root element causes empty tree')
  assert.end()
})

test('order', function (assert) {
  var expected = [
    0,
    1,
    // outer: 2, inner: 4
    [3, [5]],
    6
  ]

  var i = -1
  var actual = dfs([null, null, [null, [null]], null], function (x) {
    i++
    if (Array.isArray(x)) return x
    return i
  })

  assert.same(actual, expected)
  assert.end()
})

test('nested', function (assert) {
  assert.same(dfs([[], []], x => Array.isArray(x) ? x : assert.fail('unreachable')), [[], []])
  assert.same(dfs([1, []], x => !Array.isArray(x) ? x : dfs.continue), [1])
  assert.same(dfs([[], 1], x => !Array.isArray(x) ? x : dfs.continue), [1])
  assert.same(dfs([[1]], x => Array.isArray(x) ? x : dfs.drop), [])
  assert.same(dfs([[1]], x => dfs.spread(x)), [1])
  assert.same(dfs([[[[[[1]]]]]], x => dfs.spread(x)), [1])
  assert.same(dfs([[1, 2, 3], [4, 5, 6], [7, 8, 9]], x => Array.isArray(x) ? x : x % 2 === 0 ? x : dfs.continue), [[2], [4, 6], [8]])
  assert.same(dfs([[[1], 2], 3], x => dfs.spread(x)), [1, 2, 3])
  assert.end()
})
