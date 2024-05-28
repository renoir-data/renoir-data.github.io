---
title: "Renoir"
description: "Home page of the Renoir project"
draft: false
---


### REactive Network of Operators In Rust

[API Docs](https://deib-polimi.github.io/renoir/renoir/)

Renoir *(short: Noir)  [/ʁənwaʁ/, /nwaʁ/]* is a distributed data processing platform based on the dataflow paradigm that provides an ergonomic programming interface, similar to that of Apache Flink, but has much better performance characteristics.

---

Renoir converts each job into a dataflow graph of
operators and groups them in blocks. Blocks contain a sequence of operors which process the data sequentially without repartitioning it. They are the deployment unit used by the system and can be distributed and executed on multiple systems.


[Preprint](https://arxiv.org/abs/2306.04421)