import * as core from '@actions/core';
import * as github from '@actions/github';

import {debug} from "@actions/core";
import {Octokit} from "@octokit/rest";

async function run(){
  const token = process.env.GITHUB_TOKEN

  core.setCommandEcho(true);

  debug('Hello World');
  debug(token);

  const {payload} = github.context;

  const octokit = new Octokit({
    auth: token
  })

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const pr = payload.pull_request.number;

  debug(`owner: ${owner} repo: ${repo} pr: ${pr}`);
}

(async ()=>{
  await run();
})()
