# chg [![Build Status](https://secure.travis-ci.org/heff/chg.png?branch=master)](http://travis-ci.org/heff/chg)

unfancy release history tracking

[blog post](http://blog.heff.me/post/75189221194/introducing-chg-a-simple-changelog-cli-lib)

functions:

- `init` - create a CHANGELOG.md file  
- `add` - add new changes to the changelog under a 'HEAD (Unreleased)' heading  
- `release` - move all unreleased changes under a new release version  

`chg` can be useful when built into a release/deploy script or paired with a pull request merging script like [pulley](https://github.com/jeresig/pulley).

It **does not** try to automatically generate changes from git commits or github pull requests, though you could build that on top of the `chg` functions.

### Example

```markdown
CHANGELOG
=========

## HEAD (Unreleased)
* Removed crusty semantic html, javascript app ftw

--------------------

## 2.0.0 (2007-3-13)
* Removed horrible tables, semantic html ftw
* Switched background to vertical gradient
* Added dropshadows to EVERYTHING

## 1.1.1 (2002-08-16)
* Added a dot.gif to 3,000 table cells to fix layout issues

## 1.1.0 (2002-05-17)
* Removed horrible Flash, table layout ftw
* Switched background to horizontal gray lines

## 1.0.1 (2000-07-01)
* Duplicated all Flash content in HTML so Yahoo can see it

## 1.0.0 (2000-04-14)
* Removed horrible frames, Flash ftw
* Switched background to fast moving clouds like 2advanced V3

## 0.1.0 (1997-01-26)
* Added a "GIF" of a construction worker. ha ha ha
* Navigation frame ftw
* Added repeating tanbark background to look more professional

```

## Using globally

```bash
# install
[sudo] npm install -g chg

# create CHANGELOG.md
chg init

# add a change
chg add 'My first change'

# create a release
chg release '0.0.1'
```

## Using as a node module

shell
```shell
# install
npm install chg --save
```

javascript
```js
var chg = require('chg');

// create CHANGELOG.md
chg.init({}, callback);

// add a change
chg.add('My first change', {}, callback);

// create a release
chg.release('0.0.1', {}, callback);

// each command can take a callback, but each also returns synchronously
var changeData = chg.release('3.0.0', {});
// changeData = { title: '0.0.1', changes: '* Removed crusty semantic html, javascript app ftw', changeLog: '/* entire changelog */' }

chg.find('1.1.1');
// => { title: '## 1.1.1 (2002-08-16)', changes: ['* Added a dot.gif to 3,000 table cells to fix layout issues'], changesRaw: '* Added a dot.gif to 3,000 table cells to fix layout issues' }
```

## Using as a grunt plugin

shell
```shell
# install
npm install chg --save-dev
```

Gruntfile.js
```js
grunt.loadNpmTasks('chg');
```

shell
```shell
# create CHANGELOG.md
grunt chg-init

# add a change
grunt chg-add

# create a release
grunt chg-release
```

## Using as a npm script (requires npm v2.13.0 or higher)

```json
"scripts": {
  "version": "chg release -y && git add -A CHANGELOG.md"
}
```

**The `-y` flag will use the current version in `package.json`**

## Functions

### init()
Creates a CHANGELOG.md file in the current directory.

```bash
chg init
```

```markdown
CHANGELOG
=========

## HEAD (Unreleased)
* _(none)_

--------------------
```

### add(line:String)
Add a line to the change log. The first argument is the line to add.

```bash
chg add "My new change!"
```

```markdown
CHANGELOG
=========

## HEAD (Unreleased)
* My new change!

--------------------
```

### release(version:String)
Add a line to the change log. The first argument is the version to be used as the release version.

```bash
chg release "v0.1.0"
```

```markdown
CHANGELOG
=========

## HEAD (Unreleased)
* _(none)_

--------------------

## 0.1.0 (2014-01-31)
* My new change!
```

### find(version:String)
Finds a release given a version.

### delete()
Delete the current changelog

## Release History
See [CHANGELOG.md](CHANGELOG.md) :scream_cat:

## License
Copyright (c) 2014 heff. Licensed under the Apache license.
