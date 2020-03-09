const core = require('@actions/core');
const { Toolkit } = require('actions-toolkit')
// const github = require('@actions/github');
const Parser = require('markdown-parser');
const { VM } = require('vm2');
require('dotenv').config();


let consoleOverwriteScript = `
console.oldLog = console.log;
console.log = function (value) {
  console.oldLog(value);
  return value;
};
`

try {
  // initialize VM
  const vm = new VM({
    timeout: 1000,
    sandbox: {},
    eval: false
  });
  const parser = new Parser();

  Toolkit.run(async tools => {
    async function createComment(msg, issueNumber) {
      await tools.github.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `**Code executed:**\n\n\`\`\`bash\n${JSON.stringify(msg)}\n\`\`\``
      })
    }
    // Assign repo data to variables
    const owner = tools.context.payload.repository.owner.login;
    const repo = tools.context.payload.repository.name;

    const { data: issuesRes } = await tools.github.issues.listForRepo({
      owner,
      repo
    })

    // loop thought all the issues NOTE: PR are also considered as issues
    issuesRes.forEach((issue, index) => {
      let issueNumber = issue.number
      let issueBody = issue.body


      // parse markdown
      parser.parse(issueBody, async function (err, result) {
        if (err) throw new Error(err);
        // vm is acting weirdly when setting console log twice
        if (index > 0) consoleOverwriteScript = '';

        let code = result.codes[0].code.replace(/\n,/igm, '');
        let res = vm.run(`${consoleOverwriteScript}\n${code}`)

        createComment(res, issueNumber)
      })

    })
  })
} catch (error) {
  core.setFailed(error.message);
}