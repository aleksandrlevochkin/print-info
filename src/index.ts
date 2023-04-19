import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

const getRepositoryData = async () => {
    try {
        const ownerName = core.getInput('owner-name');
        const repositoryName = core.getInput('repository-name');
        
        const authToken = core.getInput('github-token');
        const octokit = github.getOctokit(authToken);
        
        await setOutputForPulls(octokit, ownerName, repositoryName);
        await setOutputForIssues(octokit, ownerName, repositoryName);
       
      } catch (error) {
            core.setFailed(error instanceof Error ? error.message : "Exception occurred");
      }
}

const setOutputForPulls = async (octokitClient: InstanceType<typeof GitHub>, ownerName: string, repositoryName: string): Promise<void> => {
    const pulls = await octokitClient.rest.pulls.list({
        owner: ownerName,
        repo: repositoryName,
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
}

const setOutputForIssues = async (octokitClient: InstanceType<typeof GitHub>, ownerName: string, repositoryName: string): Promise<void> => {
    const issues = await octokitClient.rest.issues.listForRepo({
        owner: ownerName,
        repo: repositoryName,
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
}

getRepositoryData();