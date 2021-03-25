# DNA of Cloud (Kubernetes) Native Apps

Whether you are building new applications for the Kubernetes or seeking to migrate existing applications, DNA of Kubernetes Native App is an essential guide that should be on the shelf of every developer and architect targeting the Kubernetes.

This document describes the following facets of kubernetes-native applications:

1. One codebase, one application
2. Dependency management
3. API first
4. Design, build, release, and run
5. Configuration, credentials, and code
6. Logs
7. Disposability
8. Backing services
9. Environment parity
10. Administrative processes
11. Port binding
12. Stateless processes
13. Concurrency
14. Telemetry
15. Authentication and authorization
16. Dependencies initialization
17. Liveness and readiness probes
18. Declarative Syntax to Manage Kubernetes State

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

# Acknowledgements

- https://www.cdta.org/sites/default/files/awards/beyond_the_12-factor_app_pivotal.pdf
