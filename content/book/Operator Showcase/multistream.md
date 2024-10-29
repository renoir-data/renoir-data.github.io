---
title: Multi-Stream Operators
date: 2024-06-15
draft: false
description: "Multistream Operators"
toc: true
tags:
 - docs
 - book
weight: 150
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

There will be times where we need to merge multiple streams together to obtain the insights we need. **Renoir** provides a set of operators that allow you to merge multiple streams together.

## Join
The most common operation is to join two streams together. The `join` operator allows you to join two streams together based on a key. The key is evaluated using a closure (one for each stream) and two elements are joinded together if the keys are equal.

This operator is similar to the SQL query `SELECT a, b FROM a JOIN b ON keyer1(a) = keyer2(b)`.

```rust
let s1 = env.stream_iter(0..5u8);
let s2 = env.stream_iter(0..5i32);
let res = s1.join(s2, |n| (n % 5) as i32, |n| n % 2).drop_key().collect_vec();
```
**Renoir** offers also two other variants of the `join` operator:
- `left_join` that keeps all the elements of the left stream and the elements of the right stream that have a matching key.
- `outer_join` that keeps all the elements of both streams and the elements of the right stream that have a matching key.
- `interval_join` that allows to join two streams based on a time interval. The element of the right stream are joined with the element of the left stream if its timestamp is inside an interval centered on the timestamp of the left element.

The `join` operator is also available for `KeyedStream`, in that case the key is the one used to partition the stream.

> A more experience user may want to use the `join_with` operator that allows to customize the behaviour of the join. You can select which ship strategy and which local strategy to use. A complete list of the possible join conditions can be found in the [Join_With API documentation](https://deib-polimi.github.io/renoir/renoir/struct.Stream.html#method.join_with).

## Merge
The `merge` operator allows you to merge two streams together. The operator takes two streams and returns a new stream that contains all the elements of the two streams. The elements are not ordered in any way.

```rust
let s1 = env.stream_iter(0..10);
let s2 = env.stream_iter(10..20);
let res = s1.merge(s2).collect_vec();
```

## Zip
The `zip` operator allows you to merge two streams together. The operator takes two streams and returns a new stream that contains the elements of the two streams zipped together. The elements are ordered in the same way they are produced by the two streams.

```rust
let s1 = env.stream_iter((vec!['A', 'B', 'C', 'D'].into_iter()));
let s2 = env.stream_iter((vec![1, 2, 3].into_iter()));
let res = s1.zip(s2).collect_vec();
```

> All the element after the end of the shortest stream will be discarted 