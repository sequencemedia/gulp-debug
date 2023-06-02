import fs from 'node:fs'
import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import Vinyl from 'vinyl'
import stripAnsi from 'strip-ansi'

import debug from '#gulp-debug'

describe('`gulp-debug`', () => {
  let FILE

  const INSPECTOR = {
    messages: [],
    logger (message) {
      INSPECTOR.messages.push(stripAnsi(message))
    },
    get notCalled () {
      console.log(this.messages)
      return this.messages.length === 0
    },
    get firstMessage () {
      return this.messages[0]
    },
    get lastMessage () {
      return this.messages[this.messages.length - 1]
    }
  }

  beforeEach(() => {
    INSPECTOR.messages = []

    FILE = new Vinyl({
      cwd: './test',
      base: './test',
      path: './test/file.mjs',
      stat: fs.statSync('./test/fixture.txt'),
      contents: Buffer.from('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
    })
  })

  it('outputs debug info', () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:'
    })

    stream
      .on('end', () => {
        assert(INSPECTOR.firstMessage, 'unicorn: file.mjs')
      })
      .end(FILE)
  })

  it('outputs singular item count', () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:'
    })

    stream
      .on('end', () => {
        assert(INSPECTOR.lastMessage, 'unicorn: 1 item')
      })
      .end(FILE)
  })

  it('outputs zero item count', async () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:'
    })

    stream
      .on('end', () => {
        assert(INSPECTOR.lastMessage, 'unicorn: 0 items')
      })
      .end()
  })

  it('outputs plural item count', async () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:'
    })

    stream
      .on('end', () => {
        assert(INSPECTOR.lastMessage, 'unicorn: 2 items')
      })
      .write(FILE, () => {
        stream.end(FILE)
      })
  })

  it('does not output filenames when `showFiles` is false', async () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:',
      showFiles: false
    })

    stream
      .on('write', () => {
        assert.ok(INSPECTOR.notCalled)
      })
      .on('end', () => {
        assert(INSPECTOR.lastMessage, 'unicorn: 1 item')
      })
      .write(FILE, () => {
        stream.end()
      })
  })

  it('does not output count when `showCount` is false', async () => {
    const stream = debug({
      logger: INSPECTOR.logger,
      title: 'unicorn:',
      showCount: false
    })

    stream
      .on('end', () => {
        assert.notEqual(INSPECTOR.lastMessage, 'unicorn: 1 item')
      })
      .write(FILE, () => {
        stream.end(FILE)
      })
  })
})
