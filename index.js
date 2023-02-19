import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from '@octokit/rest';
import _ from 'lodash';
import {debug} from "@actions/core";

async function getCommits(payload, token) {
  if (!payload.commits) {
    return [];
  }
  if (payload.commits.length < 20) {
    return payload.commits;
  }

  const {data} = await new Octokit({auth: token}).repos.compareCommits({
    owner: payload.repository.owner.login,
    repo: payload.repository?.name,
    base: payload.before,
    head: payload.after,
  });

  return data.commits.map(commit=>commit.commit);
}

function parseCommits(commits) {
  if (!commits || commits.length === 0) return '';

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
  debug('Starting action');
  const token = process.env.GITHUB_TOKEN;

  const {payload} = github.context;

  if (!payload.repository) return [];

  const owner = payload.repository.owner.login;
  const repo = payload.repository?.name;

  const commits = await getCommits(payload, token);

  debug(`owner: ${owner} repo: ${repo}`);
  debug(JSON.stringify(payload));
  debug(`commit length : ${commits.length}`);

  const issueKeys = parseCommits(commits);

  core.setOutput('issueKeys', issueKeys);
}

(async () => {
  core.setCommandEcho(true);

  await run();
})()

export default run;
