'use strict';

const test = require('ava');
const plugin = require('..');

test('exports a function', t => {
    t.is(typeof plugin, 'function');
});

function makeDizzy() {
    // Simulated DizzyProvider
    class MockProvider {
        resolve() {
            return this.value;
        }

        resolveAsync() {
            return Promise.resolve(this.value);
        }
    }

    const originalResolve = MockProvider.prototype.resolve;
    const originalResolveAsync = MockProvider.prototype.resolveAsync;

    // Simulated DizzyBulkProvider
    class MockBulkProvider {
        chainMethod(methodName) {
            var result;

            result = () => {};
            result.chainTo = methodName;

            return result;
        }
    }

    const dizzyMock = {
        BulkProvider: MockBulkProvider,
        DizzyProvider: MockProvider
    };
    plugin(dizzyMock);
    const instance = new MockProvider();
    instance.value = {
        fn: () => {}
    };
    instance.originalResolve = originalResolve;
    instance.originalResolveAsync = originalResolveAsync;
    instance.MockBulkProvider = MockBulkProvider;

    return instance;
}

function keysOf(x) {
    return Object.keys(x).sort();
}

test('added .promisified() to BulkProvider', t => {
    const instance = makeDizzy();
    t.assert(
        instance.MockBulkProvider.prototype.promisified instanceof Function
    );
    t.is(
        instance.MockBulkProvider.prototype.promisified.chainTo,
        'promisified'
    );
});

test('added .promisified() to DizzyProvider', t => {
    t.assert(makeDizzy().promisified instanceof Function);
});

test('resolve() was replaced by a new function', t => {
    const instance = makeDizzy();
    t.assert(instance.resolve !== instance.originalResolve);
});

test('resolve() does not add an async method by default', t => {
    const instance = makeDizzy();
    t.deepEqual(keysOf(instance.resolve()), ['fn']);
});

test('resolve() does not add an async method when false', t => {
    const instance = makeDizzy();
    instance.promisified(false);
    t.deepEqual(keysOf(instance.resolve()), ['fn']);
});

test('resolve() adds an async method when not specified', t => {
    const instance = makeDizzy();
    instance.promisified();
    t.deepEqual(keysOf(instance.resolve()), ['fn', 'fnAsync']);
});

test('resolve() adds an async method when true', t => {
    const instance = makeDizzy();
    instance.promisified(true);
    t.deepEqual(keysOf(instance.resolve()), ['fn', 'fnAsync']);
});

test('resolve() can disable promisification', t => {
    const instance = makeDizzy();
    instance.promisified().promisified(false);
    t.deepEqual(keysOf(instance.resolve()), ['fn']);
});

test('resolve() promisifies a function with properties', t => {
    const instance = makeDizzy();
    instance.value = () => {};
    instance.value.something = callback => {
        callback();
    };
    instance.promisified();
    const val = instance.resolve();
    t.is(typeof val, 'function');
    t.is(typeof val.something, 'function');
    t.is(typeof val.somethingAsync, 'function');
});

test('resolveAsync() was replaced by a new function', t => {
    const instance = makeDizzy();
    t.assert(instance.resolveAsync !== instance.originalResolveAsync);
});

test('resolveAsync() does not add an async method by default', t => {
    const instance = makeDizzy();
    return instance.resolveAsync().then(result => {
        t.deepEqual(keysOf(result), ['fn']);
    });
});

test('resolveAsync() does not add an async method when false', t => {
    const instance = makeDizzy();
    return instance.resolveAsync(false).then(result => {
        t.deepEqual(keysOf(result), ['fn']);
    });
});

test('resolveAsync() adds an async method when specified', t => {
    const instance = makeDizzy();
    instance.promisified();
    return instance.resolveAsync(false).then(result => {
        t.deepEqual(keysOf(result), ['fn', 'fnAsync']);
    });
});

test('resolveAsync() adds an async method when true', t => {
    const instance = makeDizzy();
    instance.promisified(true);
    return instance.resolveAsync(false).then(result => {
        t.deepEqual(keysOf(result), ['fn', 'fnAsync']);
    });
});

test('resolveAsync() can disable promisification', t => {
    const instance = makeDizzy();
    instance.promisified().promisified(false);
    return instance.resolveAsync(false).then(result => {
        t.deepEqual(keysOf(result), ['fn']);
    });
});
