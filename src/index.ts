import * as core from '@actions/core';
import { GitHub, getOctokitOptions } from '@actions/github/lib/utils';
import { throttling } from '@octokit/plugin-throttling';

const runAction = async () => {
    try {
        const ownerName = core.getInput('owner-name');
        const repositoryName = core.getInput('repository-name');
        
        const authToken = core.getInput('github-token');
        const Octokit = GitHub.plugin(throttling);
        const customOctokit = new Octokit(getOctokitOptions(authToken, {
            throttle: {
                onRateLimit: () => console.warn("Rate limit is reached"),
                onSecondaryRateLimit: () => console.warn("Secondary rate limit is reached"),
            }
        }));

        const rateLimitInfo = await customOctokit.rest.rateLimit.get();
        console.log(JSON.stringify(rateLimitInfo.data.resources.core));
        console.log();
        
        await setOutputs(customOctokit, ownerName, repositoryName);
       
      } catch (error) {
            core.setFailed(error instanceof Error ? error.message : "Exception occurred");
      }
}

const setOutputs = async (octokitClient: InstanceType<typeof GitHub>, ownerName: string, repositoryName: string): Promise<void> => {
    const issuesAndPulls = await octokitClient.paginate(octokitClient.rest.issues.listForRepo, {
        owner: ownerName,
        repo: repositoryName,
        state: "all",
        per_page: 100,
    });

    const issues = issuesAndPulls.filter(issue => issue.pull_request === undefined);
    console.log(`Total issues: ${issues.length}`);
    core.setOutput("total-issues", issues.length);

    const openIssues = issues.filter(issue => issue.state === "open");
    console.log(`Open issues: ${openIssues.length}`);
    core.setOutput("open-issues", openIssues.length);

    const closedIssues = issues.filter(issue => issue.state === "closed");
    console.log(`Closed issues: ${closedIssues.length}`);
    core.setOutput("closed-issues", closedIssues.length);

    console.log();

    const pulls = issuesAndPulls.filter(issue => issue.pull_request !== undefined);
    console.log(`Total PRs: ${pulls.length}`);
    core.setOutput("total-pulls", pulls.length);

    const openPulls = pulls.filter(pull => pull.state === "open");
    console.log(`Open PRs: ${openPulls.length}`);
    core.setOutput("open-pulls", openPulls.length);

    const closedPulls = pulls.filter(pull => pull.state === "closed");
    console.log(`Closed PRs: ${closedPulls.length}`);
    core.setOutput("closed-pulls", closedPulls.length);

    openPulls.forEach(pull => console.log(pull.created_at));
}

runAction();