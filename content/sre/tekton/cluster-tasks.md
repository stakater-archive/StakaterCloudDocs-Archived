# stakater-create-git-tag-v1

stakater-create-git-tag-v1 cluster task creates semantic versions for appplications.

## Semantic versioning:
Given a version number in format x.y.z (Major.Minor.Patch)
* MAJOR bump denotes incompatible API changes,
* MINOR bump denotes backward compatible change or new feature
* PATCH bump denotes bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

## How
The task utilizes [GitVersion](https://gitversion.net/) for creating version tags.

## Version incrementing in Gitversion:

### Major Bump:
To increment Major version **“+semver: major”**  or **“+semver: breaking”** needs to be added in one of the commit messages.

### Minor Bump:
To increment Major version **“+semver: minor”**  or **“+semver: feature”** needs to be added in one of the commit messages.

### Patch Bump:
By default, patch version is bumped when no commit message is added. 
You can also add “+semver: patch”  or “+semver: bug” in the commit messages.

***Note:*** If there are multiple commit messages in a single merge request, the task will pick up the commit message with the largest bump.
Example: If the PR request contains commit messages for both major and minor bump and the existing version of the application is 1.1.1, the task will bump the version to 2.0.0, ignoring the message for minor bump.

**Default behavior when major version < 1:**
If the major version for the existing application is < 1, the task will bump the version to 1.0.0.
Example: 0.4.1 will be changed to 1.0.0.

