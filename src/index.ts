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
    const pulls = await octokitClient.paginate(octokitClient.rest.issues.listForRepo, {
        owner: ownerName,
        repo: repositoryName,
        state: "all",
        per_page: 100,
    });
    
    console.log(`Total PRs: ${pulls.length}`);
    core.setOutput("total-pulls", pulls.length);
        
    const openPulls = pulls.filter(pull => pull.state === "open");
    console.log(`Open PRs: ${openPulls.length}`);
    core.setOutput("open-pulls", openPulls.length);

    const closedPulls = pulls.filter(pull => pull.state === "closed");
    console.log(`Closed PRs: ${closedPulls.length}`);
    core.setOutput("closed-pulls", closedPulls.length);
}

const setOutputForIssues = async (octokitClient: InstanceType<typeof GitHub>, ownerName: string, repositoryName: string): Promise<void> => {
    const issues = await octokitClient.paginate(octokitClient.rest.issues.listForRepo, {
        owner: ownerName,
        repo: repositoryName,
        state: "all",
        per_page: 100,
    });

    const pulls = issues.filter(issue => issue.pull_request !== undefined);
    console.log(`Total pull requests as filtered from issues: ${pulls.length}`);

    console.log(`Total issues: ${issues.length}`);
    core.setOutput("total-issues", issues.length);

    const openIssues = issues.filter(issue => issue.state === "open");
    console.log(`Open issues: ${openIssues.length}`);
    core.setOutput("open-issues", openIssues.length);

    const closedIssues = issues.filter(issue => issue.state === "closed");
    console.log(`Closed issues: ${closedIssues.length}`);
    core.setOutput("closed-issues", closedIssues.length);
}

getRepositoryData();