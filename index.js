import * as core from '@actions/core';

import {debug} from "@actions/core";

async function run(){
  const token = process.env.GITHUB_TOKEN

  core.setCommandEcho(true);

  debug('Hello World');
  debug(token);

  const octokit = new Octokit({
    auth: token
  })
}

(async ()=>{
  await run();
})()
