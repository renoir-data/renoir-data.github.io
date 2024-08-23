---
title: From Flink to Renoir
date: 2024-06-15
draft: true
description: Moving from Flink to Renoir
slug: flink-renoir
toc: true
tags:
  - docs
  - book
weight: 200
showAuthor: false
---

> This guide assumes you have already set-up an environment for Renoir and created a cargo project following the [guide](../../install/install)

> This quick introduction follows a hands-on approach showing examples comparing the Flink API to the Renoir API

If you know Apache Flink, you will find it easy to start to use Renoir.

Just like in Flink, computations in Renoir are defined as a graph of operators, where data flows from one operator to another.

## Getting started: Wordcount

As a first task we will implement a word counting application in both Flink and Renoir, the objective is to read a file and count the occurence of all distinct words contained in it.

#### Flink

```java
// Imports...
public class WordCount {
    public static void main(String[] args) throws Exception {
        final ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

        long start = System.nanoTime();

        DataSet < String > text = env.readTextFile("text-file.txt");

        DataSet < Tuple2 < String, Integer >> counts =
            text.flatMap((value, collector) - > {
                String[] token = value.split("\\s+");
                for (String token: tokens) {
                    if (token.length() > 0) {
                        out.collect(new Tuple2 < > (token.toLowerCase(), 1));
                    }
                }
            })
            // group by the tuple field "0" and sum up tuple field "1"
            .groupBy(0)
            .sum(1);
        counts.count();

        long stop = System.nanoTime();
        System.out.printf("total:%d", stop - start);

        counts.sort(Comparator.comparing((t) - > getCount(t)));
        for (Tuple2 < String, Integer > tuple: counts) {
            System.out.printf("%s %d\n", tuple.f0, tuple.f1);
        }
    }
}

```

#### Renoir

```rust
use renoir::prelude::*;

fn main() {
    let ctx = StreamContext::new_local();

    let result = ctx
        .stream_file("/etc/passwd")
        .flat_map(|line| {
            line.split_whitespace()
                .map(|t| t.to_lowercase())
                .collect::<Vec<String>>()
        })
        .group_by_count(|word: &String| word.clone())
        .collect_vec();

    let start = Instant::now();
    ctx.execute_blocking();
    let elapsed = start.elapsed();

    if let Some(mut res) = result.get() {
        res.sort_by_key(|t| t.1);
        println!("{res:#?}");
    }
    println!("{elapsed:?}");
}

```

# WIP: This guide is still incomplete