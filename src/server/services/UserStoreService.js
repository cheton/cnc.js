import events from 'events';
import fs from 'fs';
import * as chalk from 'chalk';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _isPlainObject from 'lodash/isPlainObject';
import _set from 'lodash/set';
import _unset from 'lodash/unset';
import logger from '../lib/logger';

const log = logger('user-store-service');

const defaultState = { // default state
    checkForUpdates: true,
    controller: {
        exception: {
            ignoreErrors: false
        }
    }
};

class UserStoreService extends events.EventEmitter {
    file = '';

    config = {};

    watcher = null;

    // @param {string} file The path to a filename.
    // @return {object} The config object.
    load(file) {
        this.file = file;
        this.reload();
        this.emit('load', this.config); // emit load event

        if (this.watcher) {
            // Stop watching for changes
            this.watcher.close();
            this.watcher = null;
        }

        try {
            if (!fs.existsSync(this.file)) {
                const content = JSON.stringify({});
                fs.writeFileSync(this.file, content, 'utf8');
            }

            this.watcher = fs.watch(this.file, (eventType, filename) => {
                log.debug(`fs.watch(eventType='${eventType}', filename='${filename}')`);

                if (eventType === 'change') {
                    log.debug(`"${filename}" has been changed`);
                    const ok = this.reload();
                    ok && this.emit('change', this.config); // it is ok to emit change event
                }
            });
        } catch (err) {
            log.error(err);
            this.emit('error', err); // emit error event
        }

        return this.config;
    }

    reload() {
        try {
            if (fs.existsSync(this.file)) {
                this.config = JSON.parse(fs.readFileSync(this.file, 'utf8'));
            }
        } catch (err) {
            err.fileName = this.file;
            log.error(`Unable to load data from ${chalk.yellow(JSON.stringify(this.file))}: err=${err}`);
            this.emit('error', err); // emit error event
            return false;
        }

        if (!_isPlainObject(this.config)) {
            log.error(`"${this.file}" does not contain valid JSON`);
            this.config = {};
        }

        this.config.state = {
            ...defaultState,
            ...this.config.state,
        };

        return true;
    }

    sync() {
        try {
            const content = JSON.stringify(this.config, null, 4);
            fs.writeFileSync(this.file, content, 'utf8');
        } catch (err) {
            log.error(`Unable to write data to "${this.file}"`);
            this.emit('error', err); // emit error event
            return false;
        }

        return true;
    }

    has(key) {
        return _has(this.config, key);
    }

    get(key, defaultValue) {
        if (!this.config) {
            this.reload();
        }

        return (key !== undefined)
            ? _get(this.config, key, defaultValue)
            : this.config;
    }

    set(key, value, options) {
        const { silent = false } = { ...options };

        if (key === undefined) {
            return;
        }

        const ok = this.reload(); // reload before making changes
        _set(this.config, key, value);
        ok && !silent && this.sync(); // it is ok to write
    }

    unset(key) {
        if (key === undefined) {
            return;
        }

        const ok = this.reload(); // reload before making changes
        _unset(this.config, key);
        ok && this.sync(); // it is ok to write
    }
}

export default UserStoreService;
