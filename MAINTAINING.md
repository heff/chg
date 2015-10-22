# MAINTAINING

A guide for anyone with push access.

In general we follow the [C4.1 governance model from 0MQ](http://rfc.zeromq.org/spec:22). Some important notes:
- Every change should come through a pull request, made from another fork (changes to docs/guides can be made directly)
- Every pull request needs to be reviewed by at least two maintainers, or one more if submitted by a maintainer

## Changelog

We use chg (what??)

```
npm install -g chg
```

Make sure every pull request gets a changelog item, either included with the PR or added after

```
chg add 'Added some feature ([PR-NUM](pr-link))'
```

## Releases

```shell

# ensure local repo is up to date
git pull upstream master

chg release [next version]
git add CHANGELOG.md
git commit -m 'Added the next release to the changelog'
npm version [version type]
git push upstream master
git push upstream --tags
npm publish




```
