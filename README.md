# Parse jira issue keys from commit messages when pushed

## Description

An action that parses all the possible issue keys from the commit message.

###### Environment variables
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

###### Usage
```yaml
jobs:
  parse: 
    steps: 
      - name: parse-issue-keys
        uses: monkb/parse-jira-issue-keys@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Reference
[HighwayThree/jira-extract-issue-keys](https://github.com/HighwayThree/jira-extract-issue-keys)
