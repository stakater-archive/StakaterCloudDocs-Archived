## Introduction

[SonarQube](https://www.sonarqube.org/) 

We offer SonarQube as managed addon to analyze the code's quality.

SonarQube performs static code analysis to evaluate code quality, using analysis rules that focus on three areas:

- **Code Reliability**: Detect bugs that will impact end-user functionality
- **Application Security**: Detect vulnerabilities and hot spots that can be exploited to compromise the program
- **Technical Debt**: Keep you codebase maintainable to increase developer velocity

SonarQube [plugs into the application lifecycle management (ALM)](https://docs.sonarqube.org/latest/architecture/architecture-integration/#header-2) process to make continuous inspection part of continuous integration. Adding code analysis to ALM provides regular, timely feedback on the quality of the code being produced. The goal is to detect problems as soon as possible so that they can be resolved before they can impact production end users.

The continuous integration (CI) server integrates SonarQube into the ALM. The SonarQube solution consists of several components: The central component is the SonarQube Server, which runs the SonarScanner, processes the resulting analysis reports, stores the reports in SonarQube Database, and displays the reports in the SonarQube UI. A CI server uses a stage/goal/task in its build automation to trigger the language-specific SonarScanner to scan the code being built. Developers can view the resulting analysis report in the SonarQube UI.

**From a tester’s standpoint**, SonarQube is worth attention because it will help you pinpoint the spots where automated testing is thin or nonexistent. It may also help target manual penetration and security testing.

**From a developer’s standpoint**, SonarQube is worth the effort because it helps you grow as a coder. From language-specific subtleties to thread safety and resource management, SonarQube can show you what you’re getting wrong—or doing sub-optimally—and point you in the right direction for fixing it. That guidance isn’t just for the folks fresh out of school. Experienced programmers can learn from SonarQube, too, even if it’s only that their super-elegant code will be unreadable to the new guy. Plus, let’s face it; everyone has off days, and SonarQube helps coders find their goofs and fix them quickly.

**From a software architect’s standpoint**, SonarQube is worth the time because it helps you keep an eye on whether your cleanly delineated initial design is being degraded over time with creeping dependency cycles. It can show you whether the internal coding rules are being followed, and it can help you spot rising complexity that needs to be refactored.

**From a project management standpoint**, SonarQube is worth the focus because testing alone isn’t enough. It can only show whether software does what it’s supposed to do: its level of external quality. On the other hand, SonarQube analyzes and fosters internal quality: whether an application will run optimally and be readily maintainable and extensible down the road.
