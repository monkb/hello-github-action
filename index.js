import * as core from '@actions/core';
import * as github from '@actions/github';
import _ from 'lodash';
import {debug} from "@actions/core";

function parseCommits(commits) {
  if (!commits) return '';

  const jiraIssueKeyRegex = /([A-Za-z]{2,10}-[0-9]{1,5})/g;

  return _.uniq(commits.map(commit => {
    const message = commit.message;
    const matches = message.match(jiraIssueKeyRegex);
    if (matches) {
      return matches;
    }
  }).flat().filter(match => match).map(match => match.toUpperCase())).join(',');
}

async function run() {
  const token = process.env.GITHUB_TOKEN;

  const {payload} = github.context;

  if (!payload.repository) return [];

  const owner = payload.repository.owner.login;
  const repo = payload.repository?.name;
  const commits = payload?.commits;

  debug(`owner: ${owner} repo: ${repo}`);
  debug(JSON.stringify(payload));

  const issueKeys = parseCommits(commits);

  core.setOutput('issueKeys', issueKeys);
}

(async () => {
  core.setCommandEcho(true);

  await run();
})()

export default run;
