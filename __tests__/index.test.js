import run from '../index.js';
import * as core from '@actions/core';
import * as github from '@actions/github';

beforeEach(() => {
  github.context.payload = {
    repository:{
      owner: {
        login: 'testUser',
      },
      name: 'testingRepoName',
    },
    commits: [],
  }
});

describe('' , () => {
  it('what if commit message does not exist' , async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      }
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name)=>{
      if(name === 'issueKeys'){
        return '';
      }
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('');
  });

  it('commit messages without issue keys' , async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      },
      commits: [
        {message : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero laboriosam tenetur veritatis minus. Nihil, atque cupiditate officia quas placeat rem, delectus ea non illum deserunt tenetur natus aut. Eveniet, mollitia.'},
        {message : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero laboriosam tenetur veritatis minus. Nihil, atque cupiditate officia quas placeat rem, delectus ea non illum deserunt tenetur natus aut. Eveniet, mollitia.'},
      ]
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name, value)=>{
      return value;
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('');
  });

  it('commit messages without issue keys' , async () => {
    github.context.payload = {
      repository: {
        owner: {
          login: 'monkb',
        },
        name: 'test-project',
      },
      commits: [
        {message : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. SWS-234-3452 sws-234 asdfsadf'},
        {message : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. RSV-23521-33 RSV-12312412 RSV 13213'},
      ]
    }

    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementation((name, value)=>{
      return value;
    })

    await run();

    expect(coreOutput.mock.results[0].value).toBe('SWS-234,RSV-23521,RSV-12312');
  });
});
