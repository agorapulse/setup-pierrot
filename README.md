# Setup Pierrot Action

<img src="https://agorapulse.github.io/pierrot/images/pierrot.png" alt="drawing" style="width:200px;height:200px"/>

This action sets up [Pierrot CLI](https://agorapulse.github.io/pierrot/) for using in GitHub Actions.

* It downloads (if it is not cached yet) required version of Pierrot CLI
* Adds `pierrot` executable to the environment
* Sets `PIERROT_TOKEN` environment variable if provided
* Sets `PIERROT_ORGANIZATION` environment variables the provided value or the current organization

# Usage

```yaml
steps:
- uses: actions/checkout@latest
- uses: agorapulse/setup-pierrot@master
  with:
    # Pierrot CLI version, default to the latest version
    version: '1.0.0'
    # Optional personal GitHub token which should have access to repositories you want to modify
    # Can be specified later as the PIERROT_TOKEN environment variable or using --github-token option
    token: ${{ secrets.PERSONAL_TOKEN }}
    # The GitHub organization to limit the searches, set to the owning organization if not provided
    # Can be bypassed by using --global flag
    organization: 'octocat'
- run: pierrot --version
```
# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Acknowledgement

This action is based on wonderful [DeLaGuardo/setup-graalvm](https://github.com/DeLaGuardo/setup-graalvm) action.
