---
title: Sequential Transformations
date: 2024-06-15
draft: false
description: "Sequential transformations"
slug: iterator-stream
toc: true
tags:
  - docs
  - book
weight: 100
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

**Renoir** offers a multitude of operators to transform and manipulate streams of data. In this section we will see how to use the basic operators to perform sequential transformations on a stream.

A sequential transformation is an operation that is applied to each element of the stream once in sequence. This allow to obtain the maximum level of parallelism and to distribute the load evenly among the available resources.

## Map
The `map` operator is used to apply a function to each element of the stream. The function can be any closure that takes an element of the stream as input and returns a new element.

```rust
// Multiply each element of the stream by 10
let res = s.map(|n| n * 10).collect_vec();
```
The map operator since it is applied to each element independently it can use the full power of parallelism.

## RichMap
The `rich_map` operator is similar to the `map` operator but it allows to keep a state between the elements of the stream. The function passed to the `rich_map` operator can be stateful and keep a state for each replica.

```rust
// Enumerate the elements of the stream
let res = s.rich_map({
    let mut id = 0;
    move |x| {
        id += 1;
        (id - 1, x)
    }
}).collect_vec();
```
> Note that the state is kept for each replica of the operator, so in this case if we keep the parallelism there will be multiple elements with the same id (one for each replica).

## Filter
The `filter` operator is used to keep only the elements of the stream that satisfy a certain condition. The function passed to the `filter` operator must return a boolean value.

```rust
// Keep only the even elements of the stream
let res = s.filter(|&n| n % 2 == 0).collect_vec();
```
The filter operator since it is applied to each element independently it can use the full power of parallelism.

## Flatten
The `flatten` operator is used to flatten a stream of collections of elements. It takes a stream of containers and returns a stream with all the contained elements.

```rust
let s = env.stream_iter((vec![
    vec![1, 2, 3],
    vec![],
    vec![4, 5],
].into_iter()));
let res = s.flatten().collect_vec();
env.execute_blocking();

assert_eq!(res.get().unwrap(), vec![1, 2, 3, 4, 5]);
```

## Concatenation of Sequential Operators
To help the user write clean and readable code, **Renoir** offers a series of concatenation of previus operators in a single call. This allows to write complex transformations in a single line of code.
From simple concatenations like `flat_map` where the result of a map is flattened, to more complex ones like `rich_filter_map` where the user can perform a stateful map and filter in a single operation.

For a complete list of operators see the [API documentation](https://docs.rs/renoir/latest/renoir/struct.Stream.html).