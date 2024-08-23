---
title: "Installing and creating a Renoir project"
date: 2024-06-15
draft: true
description: "Installing and creating a Renoir project"
tags: ["docs", "book"]
weight: 100
showAuthor: false
---

# Prerequisites

The first requirement for building a Renoir project is the Rust toolchain.

## Installing Rust

+ **Using Rustup (Recommended)**: follow the instructions at https://rustup.rs/
    + Linux (Recommended): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
    + Windows: Download and run the installer
+ **Using your package manager**: in alternative you can use the package provided by your repository

## Add rust toolchain to PATH

+ **bash**: `echo 'export PATH=$PATH:~/.cargo/bin/' >> ~/.bashrc`
+ **fish**: `set -xU fish_user_paths $fish_user_paths ~/.cargo/bin/`

## Create a new cargo project

```sh
cargo new --bin renoir-test
cd renoir-test
 # Add the renoir dependency to the `Cargo.toml`
 # Currently we recommend using the GitHub repository directly
cargo add renoir --git https://github.com/deib-polimi/renoir
```

You can now open the project in your editor of choice and start writing your application using Renoir!

> Bonus Tip: [Development Environment](/book/appendix/editor)