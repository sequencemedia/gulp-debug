import path from 'node:path'
import {
  Transform
} from 'node:stream'
import fancyLog from 'fancy-log'
import tildify from 'tildify'
import stringifyObject from 'stringify-object'
import chalk from 'chalk'
import plur from 'plur'

const WHITE_SPACE = String.fromCharCode(32)

function getFull (file, verbose = false) {
  return (
    (file.cwd ? 'cwd:'.padEnd(7, WHITE_SPACE) + chalk.blue(tildify(file.cwd)) : '') + '\n' +
    (file.base ? 'base:'.padEnd(7, WHITE_SPACE) + chalk.blue(tildify(file.base)) : '') + '\n' +
    (file.path ? 'path:'.padEnd(7, WHITE_SPACE) + chalk.blue(tildify(file.path)) : '') + '\n' +
    (file.stat && verbose ? 'stat:'.padEnd(7, WHITE_SPACE) + chalk.blue(stringifyObject(file.stat, { indent: WHITE_SPACE.repeat(7) }).replace(/[{}]/g, '').trim()) : '')
  )
}

const DEFAULT_OPTIONS = {
  logger: fancyLog,
  title: '@sequencemedia/gulp-debug:',
  minimal: true,
  showFiles: true,
  showCount: true
}

const VERBOSE_OPTIONS = {
  verbose: true,
  minimal: false,
  showFiles: true,
  showCount: true
}

export default function gulpDebug (options = {}) {
  options = {
    ...DEFAULT_OPTIONS,
    ...options
  }

  if (process.argv.includes('--verbose')) {
    options = {
      ...options,
      ...VERBOSE_OPTIONS
    }
  }

  let COUNT = 0

  function transform (file, encoding, done) {
    if (options.showFiles) {
      options.logger(options.title + ' ' + (options.minimal ? chalk.blue(path.relative(process.cwd(), file.path)) : getFull(file, options.verbose)))
    }

    done(null, file)
  }

  function flush (done) {
    if (options.showCount) {
      options.logger(options.title + ' ' + chalk.green(COUNT + ' ' + plur('item', COUNT)))
    }

    done()
  }

  const stream = new Transform({ transform, flush, objectMode: true })

  return stream.on('data', () => { COUNT++ })
}
