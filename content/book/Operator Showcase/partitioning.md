---
title: Group By and Partitioning
date: 2024-06-15
draft: false
description: "Group by and partitioning"
toc: true
tags:
 - docs
 - book
weight: 110
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

Most of the time elements in a stream need to be grouped or partitioned in some way to retrieve the desired result. **Renoir** provides a set of operators that do exactly that.

# Grouping
## Group By
Probably the most common operation is to group together elements by some common key. The key can be extracted from the element itself or computed from it. The `group_by` operator takes a closure that returns the key for each element and returns a `KeyedStream` where the operators are evaluated over elements with the same key.

```rust
let s = env.stream_iter(0..5);
// partition even and odd elements
let keyed = s.group_by(|&n| n % 2); 
```

> After the partitioning all the elements will be sent to the network to balance the load but if the desired result is an aggregation in many cases is advisable to use an associative variant of the `group_by` operator like  `group_by_reduce` or `group_by_sum`, a complete list of the possible associative variant can be found in the [Group By API documentation](https://deib-polimi.github.io/renoir/renoir/struct.Stream.html#method.group_by).

## Key By
> ADVANCED OPERATOR

Create a new 'KeyedStream' in a similar way to the `group_by` operator but without shuffling the elements over the network. **This can make other operators misbehave**. You probably want to use `group_by` instead.

```rust
let s = env.stream_iter(0..5);
let res = s.key_by(|&n| n % 2).collect_vec();
``` 

# Partitioning
## Route
Sometimes there is the need to send elements to different routes based on some condition. The `route` operator allows to create a series of routes and send the elements to the correct route based on the first met condition.
- Routes are created with the `add_route` method, a new stream is created for each route.
- Each element is routed to the first stream for which the routing condition evaluates to true.
- If no route condition is satisfied, the element is dropped

```rust
let mut routes = s.route()
 .add_route(|&i| i < 5)
 .add_route(|&i| i % 2 == 0)
 .build()
 .into_iter();
assert_eq!(routes.len(), 2);
// 0 1 2 3 4
routes.next().unwrap().for_each(|i| eprintln!("route1: {i}"));
// 6 8
routes.next().unwrap().for_each(|i| eprintln!("route2: {i}"));
// 5 7 9 ignored
env.execute_blocking();
```

## Split
Create multiple streams from a single stream where each split will have all the elements of the original stream. The `split` operator is useful when you need to apply different transformations to the same stream.

```rust
let s = env.stream_iter(0..5);
let mut splits = s.split(3);
let a = splits.pop().unwrap();
let b = splits.pop().unwrap();
let c = splits.pop().unwrap();
```
