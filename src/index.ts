import * as core from '@actions/core';
import * as github from '@actions/github';

const getRepositoryData = async () => {
    try {
        const repositoryName = core.getInput('repository-name');
        console.log(repositoryName);
        
        const authToken = core.getInput('github-token');
        const octokit = github.getOctokit(authToken);
        
        // Pulls
        const pulls = await octokit.rest.pulls.list({
            owner: "microsoft",
            repo: "typescript",
            state: "all",

        });
        console.log(`Total PRs: ${pulls.data.length}`);
        core.setOutput("total-pulls", pulls.data.length);
        
        const openPulls = pulls.data.filter(pull => pull.state === "open");
        console.log(`Open PRs: ${openPulls.length}`);
        core.setOutput("open-pulls", openPulls.length);

        const closedPulls = pulls.data.filter(pull => pull.state === "closed");
        console.log(`Closed PRs: ${closedPulls.length}`);
        core.setOutput("closed-pulls", closedPulls.length);

        // Issues
        const issues = await octokit.rest.issues.list({
            owner: "microsoft",
            repo: "typescript",
            state: "all",
        });
        console.log(`Total issues: ${issues.data.length}`);
        core.setOutput("total-issues", issues.data.length);

        const openIssues = issues.data.filter(issue => issue.state === "open");
        console.log(`Open issues: ${openIssues.length}`);
        core.setOutput("open-issues", openIssues.length);

        const closedIssues = issues.data.filter(issue => issue.state === "closed");
        console.log(`Closed issues: ${closedIssues.length}`);
        core.setOutput("closed-issues", closedIssues.length);

      } catch (error) {
            core.setFailed(error instanceof Error ? error.message : "Exception occurred");
      }
}

getRepositoryData();