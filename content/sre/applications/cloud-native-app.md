# DNA of Cloud (Kubernetes) Native Apps

Whether you are building new applications for the Kubernetes or seeking to migrate existing applications, DNA of Kubernetes Native App is an essential guide that should be on the shelf of every developer and architect targeting the Kubernetes.

## The Path to Cloud Native

The most popular application architecture on the cloud-native platforms such as Kubernetes is the microservices style. This software development technique tackles software complexity through modularization of business capabilities and trading development complexity for operational complexity.

As part of the microservices movement, there is a significant amount of theory and supplemental techniques for creating microservices from scratch or for splitting monoliths into microservices. Most of these practices are based on the Domain Driven Design book by Eric Evans (Addison-Wesley) and the concepts of bounded contexts and aggregates. Bounded contexts deal with large models by dividing them into different components, and aggregates help further to group bounded contexts into modules with defined transaction boundaries. However, in addition to these business domain considerations, for every distributed system—whether it is based on microservices or not—there are also numerous technical concerns around its organization, structure, and runtime behavior.

Containers and container orchestrators such as Kubernetes provide many new primitives and abstractions to address the concerns of distributed applications, and here we discuss the various options to consider when putting a distributed system into Kubernetes. 

Containers and cloud-native platforms bring tremendous benefits to your distributed applications, but if all you put into containers is rubbish, you will get distributed rubbish at scale. Figure below shows the mixture of the skills required for creating good cloud-native applications.

_TODO ADD IMAGE HERE_

At a high level, there are multiple abstraction levels in a cloud-native application that require different design considerations:

- At the lowest code level, every variable you define, every method you create, and every class you decide to instantiate plays a role in the long-term maintenance of the application. No matter what container technology and orchestration platform you use, the development team and the artifacts they create will have the most impact. It is important to grow developers who strive to write clean code, have the right amount of automated tests, constantly refactor to improve code quality, and are software craftsmen at heart.

- Domain-Driven Design is about approaching software design from a business perspective with the intention of keeping the architecture as close to the real world as possible. This approach works best for object-oriented programming languages, but there are also other good ways to model and design software for real-world problems. A model with the right business and transaction boundaries, easy-to-consume interfaces, and rich APIs is the foundation for successful containerization and automation later.

- The microservices architectural style very quickly evolved to become the norm, and it provides valuable principles and practices for designing changing distributed applications. Applying these principles lets you create implementations that are optimized for scale, resiliency, and pace of change, which are common requirements for any modern software today.

- Containers were very quickly adopted as the standard way of packaging and running distributed applications. Creating modular, reusable containers that are good cloud-native citizens is another fundamental prerequisite. With a growing number of containers in every organization comes the need to manage them using more effective methods and tools. Cloud native is a relatively new term used to describe principles, patterns, and tools to automate containerized microservices at scale. We use cloud native interchangeably with Kubernetes, which is the most popular open source cloud-native platform available today.

This document describes the following facets of kubernetes-native applications:

1. One codebase, one application
2. Dependency management
3. Contract first, API first
4. Design, build, release, and run
5. Configuration, credentials, and code
6. Liveness and readiness probes
7. Logging
8. Backing services
9. Telemetry
10. Administrative processes
11. Port binding
12. Stateless processes
13. Concurrency
14. Environment parity
15. Authentication and authorization
16. Dependencies initialization
17. Disposability
18. Declarative Syntax to Manage Kubernetes State
19. Secrets handling

## 1. One codebase, one application

When managing myriad aspects of a development team, the organization of code, artifacts, and other apparent minutia is often considered a minor detail or outright neglected. However, proper application of discipline and organization can mean the difference between a one-month production lead time and a one-day lead time.

Cloud-native applications must always consist of a single codebase that is tracked in a version control system. A codebase is a source code repository or a set of repositories that share a common root.

The single codebase for an application is used to produce any number of immutable releases that are destined for different environments. Following this particular discipline forces teams to analyze the seams of their application and potentially identify monoliths that should be split off into microservices. If you have multiple codebases, then you have a system that needs to be decomposed, not a single application.

The simplest example of violating this guideline is where your application is actually made of up a dozen or more source code repositories. This makes it nearly impossible to automate the build and deploy phases of your application’s life cycle.

Another way this rule is often broken is when there is a main application and a tightly coupled worker (or an en-queuer and dequeuer, etc.) that collaborate on the same units of work. In scenarios like this, there are actually multiple codebases supporting a single application, even if they share the same source repository root. This is why I think it is important to note that the concept of a codebase needs to imply a more cohesive unit than just a repository in your version control system.

Conversely, this rule can be broken when one codebase is used to produce multiple applications. For example, a single codebase with multiple launch scripts or even multiple points of execution within a single wrapper module. In the Java world, EAR files are a gateway drug to violating the one codebase rule. In the interpreted language world (e.g., Ruby), you might have multiple launch scripts within the same codebase, each performing an entirely different task.

Multiple applications within a single codebase are often a sign that multiple teams are maintaining a single codebase, which can get ugly for a number of reasons. Conway’s law states that the organization of a team will eventually be reflected in the architecture of the product that team builds. In other words, dysfunction, poor organization, and lack of discipline among teams usually results in the same dysfunction or lack of discipline in the code.

In situations where you have multiple teams and a single codebase, you may want to take advantage of Conway’s law and dedicate smaller teams to individual applications or microservices.

When looking at your application and deciding on opportunities to reorganize the codebase and teams onto smaller products, you may find that one or more of the multiple codebases contributing to your application could be split out and converted into a microservice or API that can be reused by multiple applications.

In other words, one codebase, one application does not mean you’re not allowed to share code across multiple applications; it just means that the shared code is yet another codebase.

This also doesn’t mean that all shared code needs to be a microservice. Rather, you should evaluate whether the shared code should be considered a separately released product that can then be vendored into your application as a dependency.

## 2. Dependency management

Management of application dependencies: how, where, and when they are managed.

Most contemporary programming languages have some facility for managing application dependencies. Maven and Gradle are two of the most popular tools in the Java world, while NuGet is popular for .NET developers, Bundler is popular for Ruby, and godeps is available for Go programmers. Regardless of the tool, these utilities all provide one set of common functionality: they allow developers to declare dependencies and let the tool be responsible for ensuring that those dependencies are satisfied.

Many of these tools also have the ability to isolate dependencies. This is done by analyzing the declared dependencies and bundling (also called vendoring) those dependencies into some sub-structure beneath or within the application artifact itself.

A cloud-native application never relies on implicit existence of system-wide packages. For Java, this means that your applications cannot assume that a container will be managing the classpath on the server. For .NET, this means that your application cannot rely on facilities like the Global Assembly Cache. Ruby developers cannot rely on gems existing in a central location. Regardless of language, your code cannot rely on the pre-existence of dependencies on a deployment target.

Not properly isolating dependencies can cause untold problems. In some of the most common dependency-related problems, you could have a developer working on version X of some dependent library on his workstation, but version X+1 of that library has been installed in a central location in production. This can cause everything from runtime failures all the way up to insidious and difficult to diagnose subtle failures. If left untreated, these types of failures can bring down an entire server or cost a company millions through undiagnosed data corruption.

Properly managing your application’s dependencies is all about the concept of repeatable deployments. Nothing about the runtime into which an application is deployed should be assumed that isn’t automated. In an ideal world, the application’s container is bundled (or bootstrapped, as some frameworks called it) inside the app’s release artifact—or better yet, the application has no container at all.

However, for some enterprises, it just isn’t practical (or possible, even) to embed a server or container in the release artifact, so it has to be combined with the release artifact, which, in many cloud environments like Heroku or Cloud Foundry, is handled by something called a buildpack.

Applying discipline to dependency management will bring your applications one step closer to being able to thrive in cloud environments.

## 3. Contract first, API first

Recognize your API as a first-class artifact of the development process, API first gives teams the ability to work against each other’s public contracts without interfering with internal development processes.

Even if you’re not planning on building a service as part of a larger ecosystem, the discipline of starting all of your development at the API level still pays enough dividends to make it worth your time.

Built into every decision you make and every line of code you write is the notion that every functional requirement of your application will be met through the consumption of an API. Even a user interface, be it web or mobile, is really nothing more than a consumer of an API.

By designing your API first, you are able to facilitate discussion with your stakeholders (your internal team, customers, or possibly other teams within your organization who want to consume your API) well before you might have coded yourself past the point of no return. This collaboration then allows you to build user stories, mock your API, and generate documentation that can be used to further socialize the intent and functionality of the service you’re building.

There is absolutely no excuse for claiming that API first is a difficult or unsupported path. This is a pattern that can be applied to noncloud software development, but it is particularly well suited to cloud development in its ability to allow rapid prototyping, support a services ecosystem, and facilitate the automated deployment testing and continuous delivery pipelines that are some of the hallmarks of modern cloud-native application development.

This pattern is an extension of the contract-first development pattern, where developers concentrate on building the edges or seams of their application first. With the integration points tested continuously via CI servers, teams can work on their own services and still maintain reasonable assurance that everything will work together properly.

API first frees organizations from the waterfall, deliberately engineered system that follows a preplanned orchestration pattern, and allows products to evolve into organic, self-organizing ecosystems that can grow to handle new and unforeseen demands.

Live, eat, and breathe the API-first lifestyle, and your investment will pay off exponentially.

## 4. Design, build, release, and run

### Desgin

In the world of waterfall application development, we spend an inordinate amount of time designing an application before a single line of code is written. This type of software development life cycle is not well suited to the demands of modern applications that need to be released as frequently as possible.

However, this doesn’t mean that we don’t design at all. Instead, it means we design small features that get released, and we have a high-level design that is used to inform everything we do; but we also know that designs change, and small amounts of design are part of every iteration rather than being done entirely up front.

The application developer best understands the application dependencies, and it is during the design phase that arrangements are made to declare dependencies as well as the means by which those dependencies are vendored, or bundled, with the application. In other words, the developer decides what libraries the application is going to use, and how those libraries are eventually going to be bundled into an immutable release.

### Build

### Release

### Run

## 5. Configuration, credentials, and code

### What?

Treat configuration, credentials, and code as volatile substances that explode when combined.

That may sound a bit harsh, but failing to follow this rule will likely cause you untold frustration that will only escalate the closer you get to production with your application.

In order to be able to keep configuration separate from code and credentials, we need a very clear definition of configuration. Configuration refers to any value that can vary across deployments (e.g., developer workstation, QA, and production). This could include:

- URLs and other information about backing services, such as web services, and SMTP servers
- Information necessary to locate and connect to databases
- Credentials to third-party services such as Amazon AWS or APIs like Google Maps, Twitter, and Facebook
- Information that might normally be bundled in properties files or configuration XML, or YML

Configuration does not include internal information that is part of the application itself. Again, if the value remains the same across all deployments (it is intentionally part of your immutable build artifact), then it isn’t configuration.

Credentials are extremely sensitive information and have absolutely no business in a codebase. Oftentimes, developers will extract credentials from the compiled source code and put them in properties files or XML configuration, but this hasn’t actually solved the problem. Bundled resources, including XML and properties files, are still part of the codebase. This means credentials bundled in resource files that ship with your application are still violating this rule.

If the general public were to have access to your code, have you exposed sensitive information about the resources or services on which your application relies? Can people see internal URLs, credentials to backing services, or other information that is either sensitive or irrelevant to people who don’t work in your target environments?

If you can open source your codebase without exposing sensitive or environment-specific information, then you’ve probably done a good job isolating your code, configuration, and credentials.

It should be immediately obvious why we don’t want to expose credentials, but the need for external configuration is often not as obvious. External configuration supports our ability to deploy immutable builds to multiple environments automatically via CD pipelines and helps us maintain development/production environment parity.

### How?

While application configuration can be baked into container images, it's best to make your components configurable at runtime to support deployment in multiple contexts and allow more flexible administration. To manage runtime configuration parameters, Kubernetes offers two objects called ConfigMaps and Secrets.

ConfigMaps are a mechanism used to store data that can be exposed to pods and other objects at runtime. Data stored within ConfigMaps can be presented as environment variables or mounted as files in the pod. By designing your applications to read from these locations, you can inject the configuration at runtime using ConfigMaps and modify the behavior of your components without having to rebuild the container image.

Secrets are a similar Kubernetes object type used to securely store sensitive data and selectively allow pods and other components access as needed. Secrets are a convenient way of passing sensitive material to applications without storing them as plain text in easily accessible locations in your normal configuration. Functionally, they work in much the same way as ConfigMaps, so applications can consume data from ConfigMaps and Secrets using the same mechanisms.

ConfigMaps and Secrets help you avoid putting configuration directly in Kubernetes object definitions. You can map the configuration key instead of the value, allowing you to update configuration on the fly by modifying the ConfigMap or Secret. This gives you the opportunity to alter the active runtime behavior of pods and other Kubernetes objects without modifying the Kubernetes definitions of the resources.

## 6. Liveness and readiness probes

Kubernetes includes a great deal of out-of-the-box functionality for managing component life cycles and ensuring that your applications are always healthy and available. However, to take advantage of these features, Kubernetes has to understand how it should monitor and interpret your application's health. To do so, Kubernetes allows you to define liveness and readiness probes.

Liveness probes allow Kubernetes to determine whether an application within a container is alive and actively running. Kubernetes can periodically run commands within the container to check basic application behavior or can send HTTP or TCP network requests to a designated location to determine if the process is available and able to respond as expected. If a liveness probe fails, Kubernetes restarts the container to attempt to reestablish functionality within the pod.

Readiness probes are a similar tool used to determine whether a pod is ready to serve traffic. Applications within a container may need to perform initialization procedures before they are ready to accept client requests or they may need to reload upon being notified of a new configuration. When a readiness probe fails, instead of restarting the container, Kubernetes stops sending requests to the pod temporarily. This allows the pod to complete its initialization or maintenance routines without impacting the health of the group as a whole.

By combining liveness and readiness probes, you can instruct Kubernetes to automatically restart pods or remove them from backend groups. Configuring your infrastructure to take advantage of these capabilities allows Kubernetes to manage the availability and health of your applications without additional operations work.

## 7. Logging

### What?

Logs should be treated as event streams, that is, logs are a sequence of events emitted from an application in time-ordered sequence. The key point about dealing with logs in a cloud-native fashion is, as the original 12 factors indicate, a truly cloud-native application never concerns itself with routing or storage of its output stream.

Sometimes this concept takes a little bit of getting used to. Application developers, especially those working in large enterprises, are often accustomed to rigidly controlling the shape and destination of their logs. Configuration files or config-related code set up the location on disk where the log files go, log rotation and rollover policies to deal with log file size and countless other minutiae.

Cloud applications can make no assumptions about the file system on which they run, other than the fact that it is ephemeral. A cloudnative application writes all of its log entries to stdout and stderr. This might scare a lot of people, fearing the loss of control that this implies.

You should consider the aggregation, processing, and storage of logs as a nonfunctional requirement that is satisfied not by your application, but by your cloud provider or some other tool suite running in cooperation with your platform. You can use tools like the ELK stack (ElasticSearch, Logstash, and Kibana), Splunk, Sumologic, or any number of other tools to capture and analyze your log emissions.

Embracing the notion that your application has less work to do in the cloud than it does in the enterprise can be a liberating experience.

When your applications are decoupled from the knowledge of log storage, processing, and analysis, your code becomes simpler, and you can rely on industry-standard tools and stacks to deal with logs. Moreover, if you need to change the way in which you store and process logs, you can do so without modifying the application.

One of the many reasons your application should not be controlling the ultimate destiny of its logs is due to elastic scalability. When you have a fixed number of instances on a fixed number of servers, storing logs on disk seems to make sense. However, when your application can dynamically go from 1 running instance to 100, and you have no idea where those instances are running, you need your cloud provider to deal with aggregating those logs on your behalf.

Simplifying your application’s log emission process allows you to reduce your codebase and focus more on your application’s core business value.

### How?

It is recommended application logs as JSON.

## 8. Backing services

### What?

A backing service is any service on which your application relies for its functionality. This is a fairly broad definition, and its wide scope is intentional. Some of the most common types of backing services include data stores, messaging systems, caching systems, and any number of other types of service, including services that perform line-of-business functionality or security.

When building applications designed to run in a cloud environment where the filesystem must be considered ephemeral, you also need to treat file storage or disk as a backing service. You shouldn’t be reading to or writing from files on disk like you might with regular enterprise applications. Instead, file storage should be a backing service that is bound to your application as a resource.

A bound resource is really just a means of connecting your application to a backing service. A resource binding for a database might include a username, a password, and a URL that allows your application to consume that resource.

I mentioned earlier we should have externalized configuration (separated from credentials and code) and that our release products must be immutable. Applying these other rules to the way in which an application consumes backing services, we end up with a few rules for resource binding:

- An application should declare its need for a given backing service but allow the cloud environment to perform the actual resource binding.
- The binding of an application to its backing services should be done via external configuration.
- It should be possible to attach and detach backing services from an application at will, without re-deploying the application.

As an example, assume that you have an application that needs to communicate with an Oracle database. You code your application such that its reliance on a particular Oracle database is declared (the means of this declaration is usually specific to a language or toolset). The source code to the application assumes that the configuration of the resource binding takes place external to the application.

This means that there is never a line of code in your application that tightly couples the application to a specific backing service. Likewise, you might also have a backing service for sending email, so you know you will communicate with it via SMTP. But the exact implementation of the mail server should have no impact on your application, nor should your application ever rely on that SMTP server existing at a certain location or with specific credentials.

Finally, one of the biggest advantages to treating backing services as bound resources is that when you develop an application with this in mind, it becomes possible to attach and detach bound resources at will.

Let’s say one of the databases on which your application relies is not responding. This causes a cascading failure effect and endangers your application. A classic enterprise application would be helpless and at the mercy of the flailing database.

#### Circuit Breakers

There is a pattern supported by libraries and cloud offerings called the circuit breaker that will allow your code to simply stop communicating with misbehaving backing services, providing a fallback or failsafe path. Since a circuit breaker often resides in the binding area between an application and its backing services, you must first embrace backing services before you can take advantage of circuit breakers.

A cloud-native application that has embraced the bound-resource aspect of backing services has options. An administrator who notices that the database is in its death throes can bring up a fresh instance of that database and then change the binding of your application to point to this new database.

This kind of flexibility, resilience, and loose coupling with backing services is one of the hallmarks of a truly modern, cloud-native application.

### How?

Externalize all configurations as Kubernetes configmaps or secrets for the backing services.

# Acknowledgements

Most of the text has been copied from these awesome resources; and copyrights belong to them:

- https://www.cdta.org/sites/default/files/awards/beyond_the_12-factor_app_pivotal.pdf
