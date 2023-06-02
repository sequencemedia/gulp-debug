import path from 'path'
import fancyLog from 'fancy-log'
import through from 'through2'
import tildify from 'tildify'
import stringifyObject from 'stringify-object'
import chalk from 'chalk'
import plur from 'plur'

const INDENT = String.fromCharCode(32).repeat(7)

function getFull (file, verbose = false) {
  return (
    (file.cwd ? 'cwd:'.padEnd(7, String.fromCharCode(32)) + chalk.blue(tildify(file.cwd)) : '') + '\n' +
    (file.base ? 'base:'.padEnd(7, String.fromCharCode(32)) + chalk.blue(tildify(file.base)) : '') + '\n' +
    (file.path ? 'path:'.padEnd(7, String.fromCharCode(32)) + chalk.blue(tildify(file.path)) : '') + '\n' +
    (file.stat && verbose ? 'stat:'.padEnd(7, String.fromCharCode(32)) + chalk.blue(stringifyObject(file.stat, { indent: INDENT }).replace(/[{}]/g, '').trim()) : '')
  )
}

export default (options) => {
  options = {
    logger: fancyLog,
    title: 'gulp-debug:',
    minimal: true,
    showFiles: true,
    showCount: true,
    ...options
  }

  if (process.argv.includes('--verbose')) {
    options.verbose = true
    options.minimal = false
    options.showFiles = true
    options.showCount = true
  }

  let count = 0

  return through.obj((file, encoding, done) => {
    if (options.showFiles) {
      options.logger(options.title + ' ' + (options.minimal ? chalk.blue(path.relative(process.cwd(), file.path)) : getFull(file, options.verbose)))
    }

    count++

    done(null, file)
  }, (done) => {
    if (options.showCount) {
      options.logger(options.title + ' ' + chalk.green(count + ' ' + plur('item', count)))
    }

    done()
  })
}
