# @sequencemedia/gulp-debug

Debug [Vinyl](https://github.com/gulpjs/vinyl) file streams in Gulp

This project is a fork of gulp-debug `v4.0.0` refactored in ESM and updated with latest dependencies

## Install

```bash
$ npm i -D @sequencemedia/gulp-debug
```

## Usage

```javascript
import gulp from '@sequencemedia/gulp'
import debug from '@sequencemedia/gulp-debug'

export default () => (
  gulp.src('foo.js')
    .pipe(debug({title: 'unicorn:'}))
    .pipe(gulp.dest('dist'))
);
```

## API

### debug(options?)

#### options

Type: `object`

##### title

Type: `string`\
Default: `'gulp-debug:'`

Give it a custom title so it's possible to distinguish the output of multiple instances logging at once.

##### minimal

Type: `boolean`\
Default: `true`

By default only relative paths are shown. Turn off minimal mode to also show `cwd`, `base`, `path`.

The [`stat` property](https://nodejs.org/api/fs.html#fs_class_fs_stats) will be shown when you run gulp in verbose mode: `gulp --verbose`.

##### showFiles

Type: `boolean`\
Default: `true`

Print filenames.

##### showCount

Type: `boolean`\
Default: `true`

Print the file count.

##### logger(message)

Type: `Function`\
Default: [`fancy-log`](https://github.com/js-cli/fancy-log)

Provide your own logging utility in place of [fancy-log](https://github.com/js-cli/fancy-log). The message is passed as a string in the first argument. Note that [ANSI colors](https://github.com/chalk/chalk) may be used in the message.
