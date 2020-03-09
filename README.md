# Github Code Runner Action

Github action to run code snippets from issues.
This action extracts code from Github Issue's markdown blocks and execute it.

* [Usage](#usage)
* [License](#license)

## Usage

To use this action in your project, please follow the [instructions on GitHub](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow) for initiating a workflows folder structure in your repository, if you have not done so already. 

Once you have your workflow structure set up, you can create a new workflow YAML file inside `/.github/workflows/` that contains the following:

```
on:
  issues:
    types: [opened, edited]

jobs:
  code_runner_job:
    runs-on: ubuntu-latest
    name: Code Runner
    steps:
    - name: Run Code
      uses: anuraghazra/code-runner-action@v1
    env:
      GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

Now when you `opened`, `edited` any issues this action will run and post a comment with the output of your executed codeblock.

## License

This project is under the [MIT License](LICENSE.txt)