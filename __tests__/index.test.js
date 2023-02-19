import run from '../index.js';
import * as core from '@actions/core';
import * as github from '@actions/github';
import {Octokit} from "@octokit/rest";

jest.mock('@octokit/rest');

beforeEach(() => {
  github.context.payload = {
    repository: {
      owner: {
        login: 'testUser',
      },
      name: 'testingRepoName',
    },
    commits: [],
  }
});

describe('', () => {
  it('what if commit message does not exist', async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      }
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name) => {
      if (name === 'issueKeys') {
        return '';
      }
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('');
  });

  it('commit messages without issue keys', async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      },
      commits: [
        {message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero laboriosam tenetur veritatis minus. Nihil, atque cupiditate officia quas placeat rem, delectus ea non illum deserunt tenetur natus aut. Eveniet, mollitia.'},
        {message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero laboriosam tenetur veritatis minus. Nihil, atque cupiditate officia quas placeat rem, delectus ea non illum deserunt tenetur natus aut. Eveniet, mollitia.'},
      ]
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name, value) => {
      return value;
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('');
  });

  it('commit messages with issue keys', async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      },
      commits: [
        {message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. SWS-234-3452 sws-234 asdfsadf'},
        {message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. RSV-23521-33 RSV-12312412 RSV 13213'},
      ]
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name, value) => {
      return value;
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('SWS-234,RSV-23521,RSV-12312');
  });

  it('when commits are more than 20', async function () {

    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      },
      commits: new Array(21).fill({message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. SWS-234-3452 sws-234 asdfsadf'})
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name, value) => {
      return value;
    })

    Octokit.mockImplementation(() => {
      return {
        repos: {
          compareCommits: ({}) => {
            return {
              // length 21
              data: {
                commits: [{
                  commit: {message: 'lorem ipsum LOIP-1',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-2',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-3',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-4',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-5',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-6',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-7',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-8',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-9',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-10',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-11',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-12',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-13',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-14',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-15',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-16',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-17',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-18',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-19',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-20',}
                }, {
                  commit: {message: 'lorem ipsum LOIP-21',}
                }]
              }
            }
          }
        }
      }
    });

    await run();

    expect(coreOutput.mock.results[0].value).toBe('LOIP-1,LOIP-2,LOIP-3,LOIP-4,LOIP-5,LOIP-6,LOIP-7,LOIP-8,LOIP-9,LOIP-10,LOIP-11,LOIP-12,LOIP-13,LOIP-14,LOIP-15,LOIP-16,LOIP-17,LOIP-18,LOIP-19,LOIP-20,LOIP-21');
  });
});
