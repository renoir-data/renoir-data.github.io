---
title: From Iterators to Streams
date: 2024-06-15
draft: false
description: Moving from Iterators to parallel Streams
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
>This is a quick start guide intended for people with some familiarity with the Rust programming language. It is intended as a jump start to get you writing Renoir programs quickly, but it is not complete, so refer to the rest of the documentation for more details.

The fastest introduction to Renoir is to start by thinking of it as smart iterators (you may have seen a similar approach with [Rayon](https://docs.rs/rayon/latest))

With `Iterator` you have a sequence of operators and you apply transformations such as `map()` or `filter()` to transform the sequence and eventually you will either collect the result to a collection or perform some kind of operation that consumes the iterator, like `sum()`.

Renoir's `Stream` work the same way, you can think of streams in a similar way to iterators, they allow you to start from a `Source` that generates a sequence of items, transform them using `Operator`s and collect them or consume the stream using a `Sink`.

The key difference is that Renoir's stream are optimized for parallel and distributed computations and can be seamlessly executed on one or multiple connected machines.

## Context

Due to the distributed nature of Renoir, we need to do a couple of things before we get started. (We start with an example with a local deployment and show how to easily pass to a distributed deployment later)

```rust
// We impor the core components of renoir
use renoir::prelude::*;

fn main() {
	let ctx = StreamContext::new_local();
	// ... Streams and operators
	ctx.execute_blocking();
	// ...
}
```

Every Renoir `Stream` lives within a `StreamContext`. The context can contain multiple streams and operators and is the object that rules the execution of all the streams within it.

1. A `StreamContext` is created
2. One or more `Stream`s are defined within the context
3. The `StreamContext` is executed resulting in the execution of all streams within it

> By default Renoir provides an `execute_blocking()` method that starts all the streams and operators and waits until all have finished. It is possible to run the execution in the background by running the `StreamContext::execute_blocking()` method in another thread
> ```rust
> std::thread::spawn(move || ctx.execute_blocking());
> ```
> Or it is also possible to use the asynchronous `StreamContext::execute()` method if the `tokio` feature is enabled. Note: for performance reasons, only some parts of the system are executed on the asynchronous scheduler when the feature is enabled, while most operators run on separate threads.

## From Iterators to Streams

```rust
// With iterators
fn main() {
	let input = 0..200;
	let output = input
		.filter(|x| x % 3 == 0 || x % 5 == 0)
		.map(|x| x * 2)
		.collect::<Vec<_>>();
	println!("{output:?}");
}
```

```rust
// With renoir
use renoir::prelude::*;
fn main() {
	let ctx = StreamContext::new_local();
	let input = 0..100;

	// We are streaming the iterator from our machine
	let output = ctx.stream_iter(input)
		.filter(|x| x % 3 == 0 || x % 5 == 0)
		.map(|x| x * 2)
		.collect_vec();
		// We collect the output back to our machine
	ctx.execute_blocking();

	// Since this same streams could be executed in a distributed deployment,
	// we need to make sure that this node is the one that collected the output.
	if let Some(output) = output.get() {
		println!("{output:?}");
	}
}
```
### Distributing the data

In the previous example, we used a single node deployment (`StreamContext::new_local()`) and we used the `IteratorSource`, which takes as input an iterator from the **first node** in the deployment and feeds its elements into a stream.

What if we wanted to run this in parallel?

We have multiple options:
+ Partition and distribute the data after the source randomly
+ Partition and distribute the data after the source according to a grouping logic
+ Use a parallel source

#### Shuffling items
```rust
let output = ctx.stream_iter(input)
	.shuffle()
	.filter(|x| x % 3 == 0 || x % 5 == 0)
	.map(|x| x * 2)
	.collect_vec();
```

By adding a `shuffle` operator after our source, elements will be distributed uniformly between all the available replicas for the next operator. (As we are still in a local deployment, by default operators that have no limits on replication will be replicated a number of times equal to the available cores in the system)

#### Grouping items

One of the most versatile operators in Renoir's toolkit is the `group_by` operator and its derivatives. This operator allows you to define a *Key* for each element, elements with the same Key belong to the same group.
When items are grouped, the groups are divided between replicas according to the `Hash` of the Key.

After applying a grouping operator, the `Stream` will become a `KeyedStream` that allows to interact with the stream using the grouping information
```rust
let output = ctx.stream_iter(input)
	.group_by(|x| x / 10)
	.filter(|x| x % 3 == 0 || x % 5 == 0)
	.map(|x| x * 2)
	.collect_vec();
// Note: the output of this example is different from the previous
```
