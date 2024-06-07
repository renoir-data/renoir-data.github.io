---
title: "Renoir"
description: "Home page of the Renoir project"
draft: false
---
📖 [Documentation](https://deib-polimi.github.io/renoir/renoir/)

Renoir *(short: Noir)  [/ʁənwaʁ/, /nwaʁ/]* is a distributed data processing platform based on the dataflow paradigm that provides an ergonomic programming interface, similar to that of Apache Flink, but has much better performance characteristics.

---

Renoir converts each job into a dataflow graph of
operators and groups them in blocks. Blocks contain a sequence of operors which process the data sequentially without repartitioning it. They are the deployment unit used by the system and can be distributed and executed on multiple systems.

## Resources

{{< github repo="deib-polimi/renoir" >}}

```sh
{{< typeit lifeLike=true >}}
$ cargo init --bin 
$ cargo add renoir
{{< /typeit >}}
```

{{< list
  title="Publications"
  value="publications"
  cardView=true
  where="Type"
  limit=6
>}}

## Team

