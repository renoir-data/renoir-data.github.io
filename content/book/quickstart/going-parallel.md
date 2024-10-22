---
title: Going Parallel
date: 2024-06-15
draft: false
description: Distributed computations with Renoir
toc: true
tags:
  - docs
  - book
weight: 110
showAuthor: false
showTableOfContents: true
showBreadcrumbs: true
---

In this section we will see how easy it is to run the computaion of **Renoir** in parallel and distribute it across multiple machines.

The informations about the environment in which the computation will run are stored in a `StreamContext`. The context can contain multiple streams and operators and is the object that rules the execution of all the streams within it.

## Local Deployment
To run a computation on a single machine, you can create a `StreamContext` with the `new_local()` method.
This method creates a context that will run the stream using all the available resources of the machine.

```rust
let ctx = StreamContext::new_local();
// ... Streams and operators
```

if you want to specify the number of threads to use, you can create a custom `RuntimeConfig` easily by using the `local(..)` method.

```rust
let config = RuntimeConfig::local(4).unwrap();
let ctx = StreamContext::new(config);
// ... Streams and operators
```

## Distributed Deployment
To run a computation on multiple machines, you can create a `StreamContext` with the `remote(..)` method.
This method takes as argument the path to a configuration file (toml) that contains the information about the cluster.

```rust
let config = RuntimeConfig::remote("path/to/config.toml").unwrap();
config.spawn_remote_workers();
let ctx = StreamContext::new(config);
// ... Streams and operators
```
> If you want to use a distributed environment you have to spawn them using `spawn_remote_workers` before asking for some stream.

the configuration file should contain the information necessary to connect to the various machines in the cluster, for example:

```toml
# config.toml
[[host]]
address = "host1.lan"
base_port = 9500
num_cores = 16

[[host]]
address = "host2.lan"
base_port = 9500
num_cores = 24
ssh = { username = "renoir", key_file = "/home/renoir/.ssh/id_ed25519" }
```
And just like that your pipeline will be automatically distributed across both machines.

> Available options for the `RuntimeConfig` are:
> - `address`: a string with the address of the machine
> - `base_port`: starting port for the communication between operators on different machines
> - `num_cores`: number of cores available on the machine
> - `ssh`: object to store the ssh connection information
>> - `ssh_port`: port to connect to the machine
>> - `username`: username to connect to the machine
>> - `password`: password to connect to the machine
>> - `key_file`: path to the private key file
>> - `key_passphrase`: passphrase for the private key file

## Context from Arguments
To decide the environment in which the computation will run each time, you can pass the context as an argument to the program.

```rust
let (config, args) = RuntimeConfig::from_args();
let ctx = StreamContext::new(config);
// ... Streams and operators
```
and when you run the program you can pass the arguments to the program, specifing if you want to run the computation locally or remotely.

```bash
cargo run -- --local num_of_thread
cargo run -- --remote path/to/config.toml
``` 

<!-- CUSTOM ENV -->
