---
title: Iterative Operators
date: 2024-06-15
draft: false
description: "Iterative Operators"
toc: true
tags:
 - docs
 - book
weight: 160
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

There could be the possibility that you need to iterate over a stream multiple times to obtain the right insights or to perform a complex computation. **Renoir** provides a set of operators exactly for this purpose.

## Iterate
This operator allows to create an iterative workflow where the data cycle through the same set of operators multiple times. This operator has several features:
- **Max Iterations**: The maximum number of iterations to perform. If the maximum number of iterations is reached, the operator will stop the iteration and output the current state of the data.
- **Iteration State**: The state that all the replica of this operator can read. The state can be updated at the end of each iteration by the `global_fold` function.
- **Body**: The set of operators that will be executed at each iteration. The output of the body will be used as the input of the next iteration.
- **Local Fold**: The function that will be executed by each replica used to update the Iteration State, the results will be aggregated by the `global_fold` function.
- **Global Fold**: The function that will be executed to aggregate the results of the `local_fold` function and update the Iteration State.
- **Loop Condition**: The condition that will be evaluated at the end of each iteration to decide if the iteration should continue or not.

```Rust
let s = env.stream_iter(0..3).shuffle();
let (state, items) = s.iterate(
    3, // at most 3 iterations
    0, // the initial state is zero
    |s, state| s.map(|n| n + 10),
    |delta: &mut i32, n| *delta += n,
    |state, delta| *state += delta,
    |_state| true,
);
let state = state.collect_vec();
let items = items.collect_vec();
```
> if you want to cycle back the same initial input and not the result of the previous iteration, you can use the `replay` operator. The `replay` is very similar to the `iterate` operator i.e it requires the same parameters, but it will replay the input stream at each iteration.
