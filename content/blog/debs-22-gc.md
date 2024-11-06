---
title: "Analysis of market data with Noir: DEBS grand challenge
(DEBS'22)"
date: 2022-06
summary: "Today, data analysis drives the decision-making process in virtually every human activity. This demands for software platforms that offer simple programming abstractions to express data analysis tasks and that can execute them in an efficient and scalable way..."
draft: false
weight: 2000
showTableOfContents: true
showBreadcrumbs: true
---

We are happy to announce that we won the **DEBS 2022 Grand Challenge** with our platform: **Renoir**. 

The **Distributed and Event-Based Systems (DEBS) Grand Challenge** is a prestigious competition that evaluates the performance of distributed systems in processing large-scale data streams. Our submission showcases the capabilities of **Renoir**, a data processing platform that combines high-level programming abstractions with efficient execution.
{{< alert icon="graduation-cap" cardColor="" iconColor="#ffffff" textColor="#ffffff">}}
**Click 
[here](https://dl.acm.org/doi/10.1145/3524860.3539646)
to read the full article!**
{{< /alert >}}

## The DEBS 2022 Grand Challenge
The 2022 DEBS Grand Challenge involves **analyzing real-world market data from Infront Financial Technology**, consisting of over 50 million trading events across three major exchanges. 

Participants are tasked with implementing a trading strategy that identifies temporal price trends of individual equities within non-overlapping time windows and triggers buy/sell advice when specific patterns are detected.

The challenge highlights the tension between general-purpose data processing frameworks, which offer ease of use, and the performance gains achievable through custom, low-level implementations. Participants are encouraged to create reusable and extensible solutions to this data-intensive problem.

## Renoir: A High-Performance Data Processing Platform
**Renoir**, our data processing platform, was born out of a need to handle streaming data with **unparalleled efficiency and simplicity**. Built on principles similar to those of leading data processing frameworks such as Apache Flink and Spark, Renoir adds its unique flavor of** high-level abstraction without compromising performance**.

The platform is designed to **abstract the complexities of deployment, concurrency, and synchronization**, allowing developers to focus on building logic. Renoir uses a streamlined pipeline structure that processes data as directed acyclic graphs, breaking down each step into manageable stages. This model is crucial for tasks involving continuous data streams where split-second decision-making can make a **significant difference​**.

It uses **optimized communication channels** to pass data between processing nodes efficiently, **minimizing bottlenecks and latency**. This characteristic is key for applications like financial data analysis, where the ability to react to new information quickly is fundamental.

## Our Solution

The solution's architecture featured the following components:

- **gRPC Communication Module**: To interact with the challenge's evaluation platform, we implemented a custom gRPC module that handled both incoming data and outgoing results. This module established **parallel connections** to optimize the flow of data.

- **Event Stream Handling**: We created a data pipeline starting with a `flat_map` operator that **decomposed batches into individual trading events and subscriptions**. Events were partitioned by their symbol using a `group_by` operator, enabling **parallel processing across different instruments**.

- **EMA Calculation and State Management**: A custom `rich_filter_map` operator maintained state for each financial instrument. This operator **computed the EMAs** using recent price data, updating internal state as new events were processed. When a subscription request was detected, the current state, including the most recent EMAs and trading signals, was emitted downstream.

- **Results Collection and Submission**: The final step in the data pipeline involved collecting the processed results and **submitting them back to the evaluation platform through the gRPC module**. This submission was synchronized to ensure that all results for a batch were completed before transmission​.

As a  bonus request we implemented a **smart visualization tool** to better understand the data and the results of our analysis. This was done by sending the data from the `rich_filter_map` operator to a **Redis database** and then using a web interface to visualize the data.

## Evaluation
Testing our solution involved deploying it on the provided DEBS Grand Challenge infrastructure, which included machines with Intel Haswell CPUs and a specific number of cores. We measured two main performance metrics: **total execution time and latency per batch**.

- **Total Execution Time**: This metric represented the time from the submission of the **first gRPC request to the delivery of the last result**. The data set was divided into 5,940 batches, each containing 10,000 events, summing up to approximately 59.4 million events. The performance was assessed by calculating the throughput as the total number of events processed per unit time.

- **Latency per Batch**: We recorded the time difference between receiving a batch and submitting the processed results. This measure, presented as the 10th, median, and 90th percentiles, helped us understand how Renoir handled real-time data under load. Our experiments revealed that with a parallel configuration and optimized gRPC connections, **we reached processing speeds of up to 2.5 Gbit/s, matching the network's capacity.**

In addition to this standard evaluation, we experimented with scaling the solution on cloud platforms like Amazon EC2 and powerful local hardware to test its limits. The results demonstrated that Renoir could efficiently handle additional computational workloads without significant performance degradation, processing over 10 million events per second​.

## Conclusion

The 2022 DEBS Grand Challenge was an excellent testbed for demonstrating the strengths of Renoir. Our solution showcased **Renoir's ability to handle complex, real-time data processing tasks with a focus on scalability and low latency**. We successfully integrated modern programming techniques with powerful stream processing abstractions, proving that **high-level programming interfaces do not have to come at the expense of performance**.

In conclusion, Renoir's performance in this challenge solidified its potential as a versatile data processing platform capable of supporting demanding applications in **finance, IoT, and beyond**.