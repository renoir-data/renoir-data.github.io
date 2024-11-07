---
title: "Safe Shared State in Dataflow Systems
(DEBS'24)"
date: 2024-06
draft: false
weight: 1000
showTableOfContents: true
showBreadcrumbs: true
---

We are happy to announce that our paper **"Safe Shared State in Dataflow Systems"** has been accepted at the **18th ACM International Conference on Distributed and Event-based Systems (DEBS 2024)**.

{{< alert icon="graduation-cap" cardColor="" iconColor="#ffffff" textColor="#ffffff">}}
**Click 
[here](https://dl.acm.org/doi/10.1145/3629104.3666029)
to read the full article!**
{{< /alert >}}

## Why shared state matters

In distributed data processing, the dataflow model has become a popular choice for handling large-scale analytics tasks. However, traditional dataflow systems typically avoid any shared state across operations to simplify execution and prevent potential conflicts. While this design choice allows **tasks to run independently, it can also limit efficiency,** especially as the computing power of individual machines increases. This inspired the creation of an e**xtended model that offers a way to share state safely within a dataflow environment.**

In dataflow systems, computations are traditionally structured as sequences of operators that process data in isolation. Each operator processes its input and passes results to downstream operators, often without retaining any intermediate state. While this approach promotes reliability, it also means operators cannot share common resources, which leads to performance constraints.

For example, a system processing streaming data may repeatedly access the same data or external services, leading to redundant resource usage. **Without shared state, operators may create unnecessary copies or connections, using up memory and bandwidth.**

## Introducing Renoir’s Safe State Sharing Model
The **Renoir** dataflow system, addresses this challenge by extending the dataflow model to allow state sharing within defined limits. Renoir uses Rust’s ownership model, which enables safe sharing of resources without runtime garbage collection. **This model ensures that developers can write high-performance, scalable code that minimizes risks associated with concurrent memory access.**

Key Benefits and Use Cases:
- **Read-Only Shared Data**:
with Renoir, operators can share **read-only data across multiple tasks** within a single worker. For instance, graph-processing tasks can access a shared graph structure rather than loading individual copies, leading to better memory utilization and lower overhead.

- **Concurrent Data Structures**:
**Renoir** supports sharing concurrent data structures, such as hashsets, which **allow tasks to work in parallel while safely accessing shared resources**. Renoir ensures that data structures can be shared across tasks in read-write mode only if they guarantee safe concurrent access allowing the use of updatable data structures without risking data corruption.

- **Coordinated access to external systems**:
many data-driven applications frequently access external databases, for example in  event enrichment, which involves integrating the information carried by events in a stream with static information accessed from an external database. In **Renoir**, tasks can share a connection pool, **reducing the need for redundant connections and improving response times**.

- **Asynchronous Operations**:
the shared state model also supports asynchronous execution, ideal for applications needing network interactions. By sharing an asynchronous runtime across tasks, **Renoir can minimize context switches, improving overall throughput**.

- **Advanced Communication Patterns**:
The **traditional dataflow** paradigm consumes data from static or streaming datasets, **applies a sequence of transformations, and feeds the results to external sinks.** Yet, external systems may adopt **different patterns of interactions.**
**Renoir enables handling the request-response communication within the driver program,** which can then interact with tasks through safe shared-memory primitives, **without the overhead of external systems** such as Apache Kafka.

- **Shared Cache**: when accessing data from external resources such as a database or a remote service, some applications may tolerate slightly outdated data. In these scenarios, storing a local cache in memory with recently observed data may reduce the interactions with external resources and improve performance. **In our extended model, a single cache may be shared across the tasks running in the same worker.** This allows to reduce the memory consumption.

## Performance Results
The Renoir model demonstrates significant performance improvements in various scenarios following the use cases mentioned [above](#introducing-renoirs-safe-state-sharing-model).

- **Read-Only Shared Data**: testing our model on two graph-processing tasks, **PageRank and Connected Components**, we observed a **performance improvement of up to 3 times** compared to traditional dataflow implementations.

- **Concurrent Data Structures**: we implemented a test which involves detectung and discarding duplicate elements from an input dataset. With our implementation, **Renoir** achieved better performance while **cutting down memory usage and data transferred to the network**.

- **Coordinated access to external systems**: in a benchmark comparing Renoir with traditional dataflow systems, in using external services for data enrichment, **Renoir is up to 50 times faster** by sharing connections across tasks.

- **Asynchronous Operations**: to evaluate the benefits of our extended model we used the same event enrichment application discussed before, but we interact with the database using asynchronous API. **Renoir** achieved a **performance improvement of up to 2 times** compared to traditional dataflow systems.

- **Advanced Communication Patterns**: To exemplify the use of our shared memory model to implement custom communication patterns, we implemented the last edition of the [DEBS Grand Challenge]({{< ref "/blog/debs-22-gc.md" >}}).

- **Shared Chace**: We evaluate this scenario using another variant of the enrichment use case that caches the results of database interactions. Our implementation builds on the one presented in the previous section, and uses asynchronous API to interact with the database. It introduces a cache of recently read values that is shared across the tasks within a worker. **Renoir** achieved a **performance improvement of up to 10 times** compared to traditional dataflow systems.

## Moving Forward with Safe Shared State in Dataflow
As data processing demands continue to grow, **Renoir** provide a path forward by harnessing the power of shared state with rigorous safety guarantees. **For developers and businesses, this means the potential for more efficient, scalable systems that better utilize hardware resources.**