---
title: Reductions and Folds
date: 2024-06-15
draft: false
description: "Reductions and Folds"
toc: true
tags:
 - docs
 - book
weight: 120
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

To obtain insights from a data stream it is often necessary to aggregate the data in some way. **Renoir** provides a set of operators that allow you to perform reductions and folds over the data stream to obtain the wanted information.

## Reduce
The `reduce` operator aggregates the data of a stream following a use defined function and emit a single value. The function should modify the accumulator which will at the end be the emitted value.

```rust
let s = env.stream_iter(0..5);
let res = s.reduce(|acc, value| acc + value).collect::<Vec<_>>();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```

> Note that the type of the accumualtor is the same as the type of the stream elements. If a different type is needed condider using `fold`.

## Reduce Associative
The `reduce_assoc` operator is a variant of the `reduce` operator that can be used when the reduction function is associative. This allows the operator to be executed in parallel and can be more efficient than the `reduce` operator.

The opertor apply the reducing function in two steps:
 - **Local**: the function that will be executed on each replica.
 - **Global**: the function that will aggregate all the partial results obtained from the local functions.

```rust
let s = env.stream_iter(0..5);
let res = s.reduce_assoc(|acc, value| acc + value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```

> Note that the type of the accumualtor is the same as the type of the stream elements. If a different type is needed condider using `fold_assoc`.

## Fold
The `fold` operator aggregates the data of a stream following a use defined function and emit a single value. The function should modify the accumulator which will at the end be the emitted value. It is similar to the `reduce` operator but it allows to specify an initial value and so the type for the accumulator.


```rust
let s = env.stream_iter(0..5);
let res = s.fold(0, |acc, value| *acc += value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);
```


## Fold Associative
The `fold_assoc` operator is a variant of the `fold` operator that can be used when the reduction function is associative. Similar to the `reduce_assoc` this allows the operator to be executed in parallel and can be more efficient than the `fold` operator.

The operator requires two user defined functions:
 - **Local**: the function that will be executed on each replica.
 - **Global**: the function that will aggregate all the partial results obtained from the local functions.

```rust
Example
let s = env.stream_iter(0..5);
let res = s.fold_assoc(0, |acc, value| *acc += value, |acc, value| *acc += value).collect_vec();

env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![0 + 1 + 2 + 3 + 4]);



