---
title: "Installing the Jupyter Kernel (Optional)"
date: 2024-06-15
draft: false
description: "Installing the Jupyter Kernel to run Renoir in an interactive environment"
tags: ["docs", "book"]
weight: 200
showAuthor: false
---

## Prerequisites

Install Rust following the [install guide](../install)

## Evcxr

Rust programs can also be executed in an interactive environment.
[**Evcxr**](https://github.com/evcxr/evcxr) is an evaluation context for Rust and it provides a REPL (analog to ipython), and a Jupyter Kernel.

## Installing the Jupyter Kernel

> [Official guide](https://github.com/evcxr/evcxr/blob/main/evcxr_jupyter/README.md)

The steps to install the jupyter kernel are the following:

1. Install the `evcxr_jupyter` binary: `cargo install --locked evcxr_jupyter`
2. Install the kernel: `evcxr_jupyter --install` (Note: ensure that `$HOME/.cargo/bin` is in your `PATH` variable)

## Using the Jupyter Kernel in Visual Studio Code

> [Official guide](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

1. Install the `jupyter` package in your python environment
2. Install the [Jupyter extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
3. Create a new `.ipynb` file and open it
4. Select the Jupyter Kernel
    1. Click on the *Select Kernel* button in the top right
    2. Choose *Jupyter Kernel ...*
    3. Choose the Rust evcxr kernel you installed earlier

## Importing dependencies

Now that you have selected the kernel you can start writing code and executing it.
To import dependencies you can use the `:dep` keyword[^1].

[^1]: it follows the same syntax of cargo toml

```
:dep renoir = { git = "https://github.com/deib-polimi/renoir" }
```

Now with an `use` statement we can import what we need to use renoir.

```rust
use renoir::prelude::*;
```

#### Recommended prelude

The evcxr kernel can be tuned using special keywords according to your needs. We list some of the most useful tweaks you can make (these can be put in a cell at the beginning of the notebook)
+ `:cache SIZE` Set cache size in MiB (use for faster compilation)
+ `:opt LEVEL` Set the optimization level, default is no optimization (for faster execution use 1,2 or 3)

# Example

```rust
:cache 500
:opt 1
:dep renoir = { git = "https://github.com/deib-polimi/renoir" }
use renoir::prelude::*;
```

```rust
let ctx = StreamContext::new_local();

let result = ctx.stream_par_iter(0..100)
    .map(|x| (x, x * x))
    .collect_vec();

ctx.execute_blocking();
let output = result.get()
```
```rust
// The :vars keyword will print the variables you have set (Note: Rust lifetime rules still apply!)
:vars
```
| | |
|-|-|
| Variable | Type |
| output | Option<Vec<(i32,i32)>> |


```rust
println!("{output:?}");
```
    
*Some([(0, 0), (1, 1), (2, 4), (3, 9), (4, 16), (5, 25), (6, 36), (7, 49), (8, ...*