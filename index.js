import * as core from '@actions/core';
import {debug} from "@actions/core";

function run(){
  core.setCommandEcho(true);

  debug('Hello World');
}

run()
