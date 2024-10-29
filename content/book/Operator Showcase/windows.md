---
title: Windows
date: 2024-06-15
draft: false
description: "Windows"
toc: true
tags:
 - docs
 - book
weight: 130
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

When working with unbounded data streams is often necessary to consider only a subset of the data to perform some computation. **Renoir** provides a set of operators that allow you to define windows over the data stream to perform the computation only on the data that is part of the window.
In **Renoir** windows are defined by a descriptor `WinDescr` that allows the user to specify the type and the logic used to group the data inside the right window.

## Windows Descriptors
There are several types of descriptors that can be used:
- **CountWindow**: defines a window based on the number of elements in the window. It can be defines as `tumbling` or `sliding` windows.
- **EventTimeWindow**: defines a window based on the event timestamps of the data. It can be defines as `tumbling` or `sliding` windows.
- **ProcessingTimeWindow**: defines a window based on the wall clock at time of processing. It can be defines as `tumbling` or `sliding` windows.
- **SessionWindow**: defines a window that splits after if no element is received for a fixed wall clock duration.
- **TransactionWindow**: defines a window based on a user defined logic. A complete analysis of this descriptor can be found in the [TransactionWindow API Documentation](https://deib-polimi.github.io/renoir/renoir/operator/window/struct.TransactionWindow.html).


## Windows over a single stream
If the stream is NOT partitioned in any way like using `group_by` or `key_by` operators, the window is defined over the whole stream. 
The operator that allows you to define a window over the stream is `window_all`. The `window_all` operator takes a [descriptor](#windows-descriptors) of the window as an argument and return a windowed stream that can be used to perform computation over the window.

```Rust
let s = env.stream_iter(0..5usize);
let res = s
    .window_all(CountWindow::tumbling(2))
    // rest of the pipeline
```

> Note that since the window is defined over the whole stream, this operator cannot be parallelized. If possible partition the stream using `group_by` or `key_by` operators to allow parallel execution.

## Windows over a partitioned stream
If the stream is partitioned in some way like using `group_by` or `key_by` operators, the window is defined over each partition. We can define our windows using the `window` operator with the [descriptor](#windows-descriptors) that we want.

```Rust
let s = env.stream_iter(0..9);
let res = s
    .group_by(|&n| n % 2)
    .window(CountWindow::sliding(3, 2))
    // rest of the pipeline
```

if we want to create a window after joining two `KeyedStream` over the same key we can use the `window_join` operator.

```Rust
let s1 = env.stream_iter(0..9);
let s2 = env.stream_iter(0..9);

let res = s1
    .key_by(|&n| n % 2)
    .window_join(s2.key_by(|&n| n % 2), CountWindow::tumbling(2))
    // rest of the pipeline
```

## Operators over windows
Once the window is defined we can perform different operation to obtain the wanted information. Some of the possible operations are the standard `max`, `min`, `sum` or `count` but also more complex operations are available like the `fold` operator.

For a complete list of the available operators check the [API Documentation](https://deib-polimi.github.io/renoir/renoir/struct.WindowedStream.html#).

```Rust
let s = env.stream_iter(0..5usize);
let res = s
    .window_all(CountWindow::tumbling(2))
    .fold(0, |acc, value| acc + value)
    .collect_vec();
```
