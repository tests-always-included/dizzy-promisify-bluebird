'use strict';

const test = require('ava');
const plugin = require('..');

test('exports a function', t => {
    t.is(typeof plugin, 'function');
});

// Simulated DizzyProvider
class MockProvider {
    resolve() {
        return this.value;
    }

    resolveAsync() {
        return Promise.resolve(this.value);
    }
}

// Simulated DizzyBulkProvider
class MockBulkProvider {
    chainMethod(methodName) {
        var result;

        result = () => {};
        result.chainTo = methodName;

        return result;
    }
}

function makeDizzy() {
    const dizzyMock = {
        BulkProvider: MockBulkProvider,
        DizzyProvider: MockProvider
    };
    plugin(dizzyMock);
    const instance = new MockProvider();
    instance.value = {
        fn: () => {}
    };
    instance.oldMockProvider = MockProvider;
    return instance;
}

test('added .promisified() to BulkProvider', t => {
    makeDizzy();
    t.assert(MockBulkProvider.prototype.promisified instanceof Function);
    t.is(MockBulkProvider.prototype.promisified.chainTo, 'promisified');
});

test('added .promisified() to DizzyProvider', t => {
    t.assert(makeDizzy().promisified instanceof Function);
});

test('resolve() was replaced by a new function', t => {
    const instance = makeDizzy();
    t.assert(instance.resolve !== instance.oldMockProvider.resolve);
});

test('resolve() does not add an async method by default', t => {
    const instance = makeDizzy();
    t.is(instance.resolve(), instance.value);
});

test('resolve() does not add an async method when false', t => {
    const instance = makeDizzy();
    instance.promisified(false);
    t.is(instance.resolve(), instance.value);
});


/*
        describe('resolve', () => {
            it('does not add an async method when false', () => {
                instance.promisified(false);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function)
                });
            });
            it('adds an async method when specified', () => {
                instance.promisified();
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function),
                    fnAsync: jasmine.any(Function)
                });
            });
            it('adds an async method when true ', () => {
                instance.promisified(true);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function),
                    fnAsync: jasmine.any(Function)
                });
            });
            it('can disable promisification', () => {
                instance.promisified().promisified(false);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function)
                });
            });
            it('promisifies a function with properties', () => {
                var val;

                instance.value = () => {};
                instance.value.something = callback => {
                    callback();
                };
                instance.promisified(true);
                val = instance.resolve();
                expect(val).toEqual(jasmine.any(Function));
                expect(val.somethingAsync).toEqual(jasmine.any(Function));
            });
        });
        describe('resolveAsync', () => {
            it('was replaced by a new function', () => {
                expect(instance.resolveAsync.and).not.toBeDefined();
            });
            it('does not add an async method by default', () => {
                return instance.resolveAsync().then(result => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
            it('does not add an async method when false', () => {
                instance.promisified(false);

                return instance.resolveAsync().then(result => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
            it('adds an async method when specified', () => {
                instance.promisified();

                return instance.resolveAsync().then(result => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function),
                        fnAsync: jasmine.any(Function)
                    });
                });
            });
            it('adds an async method when true ', () => {
                instance.promisified(true);

                return instance.resolveAsync().then(result => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function),
                        fnAsync: jasmine.any(Function)
                    });
                });
            });
            it('can disable promisification', () => {
                return instance.resolveAsync().then(result => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
        });
    });
});
*/
