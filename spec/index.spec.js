"use strict";

var plugin;

plugin = require("..");

describe("dizzy-promisify-bluebird", () => {
    it("exports a function", () => {
        expect(typeof plugin).toBe("function");
    });
    describe("on Dizzy", () => {
        var instance;

        /**
         * Fake class pretending to be a DizzyProvider object.
         */
        class MockProvider {
            /**
             * Resolves to a value
             *
             * @return {*}
             */
            resolve() {
                return this.value;
            }

            /**
             * Returns the value asynchronously
             *
             * @return {Promise.<*>}
             */
            resolveAsync() {
                return Promise.resolve(this.value);
            }
        }


        /**
         * Another fake class, this time for the bulk provider
         */
        class MockBulkProvider {
            /**
             * Fake method used internally to create functions for
             * the bulk provider.
             *
             * @param {string} methodName
             */
            chainMethod(methodName) {
                var result;

                result = () => {};
                result.chainTo = methodName;
            }
        }

        beforeEach(() => {
            var dizzyMock;

            spyOn(MockProvider.prototype, "resolve").andCallThrough();
            spyOn(MockProvider.prototype, "resolveAsync").andCallThrough();
            dizzyMock = {
                BulkProvider: MockBulkProvider,
                DizzyProvider: MockProvider
            };
            plugin(dizzyMock);
            instance = new MockProvider();
            instance.value = {
                fn: () => {}
            };
        });
        it("adds .promisified() to BulkProvider", () => {
            expect(MockBulkProvider.prototype.promisified).toEqual(jasmine.any(Function));
            expect(MockBulkProvider.prototype.promisified.chainTo).toEqual("promisified");
        });
        it("adds .promisified() to DizzyProvider", () => {
            expect(instance.promisified).toEqual(jasmine.any(Function));
        });
        describe("resolve", () => {
            it("was replaced by a new function", () => {
                expect(instance.resolve.andCallThrough).not.toBeDefined();
            });
            it("does not add an async method by default", () => {
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function)
                });
            });
            it("does not add an async method when false", () => {
                instance.promisified(false);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function)
                });
            });
            it("adds an async method when specified", () => {
                instance.promisified();
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function),
                    fnAsync: jasmine.any(Function)
                });
            });
            it("adds an async method when true ", () => {
                instance.promisified(true);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function),
                    fnAsync: jasmine.any(Function)
                });
            });
            it("can disable promisification", () => {
                instance.promisified().promisified(false);
                expect(instance.resolve()).toEqual({
                    fn: jasmine.any(Function)
                });
            });
        });
        describe("resolveAsync", () => {
            it("was replaced by a new function", () => {
                expect(instance.resolveAsync.andCallThrough).not.toBeDefined();
            });
            it("does not add an async method by default", () => {
                return instance.resolveAsync().then((result) => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
            it("does not add an async method when false", () => {
                instance.promisified(false);

                return instance.resolveAsync().then((result) => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
            it("adds an async method when specified", () => {
                instance.promisified();

                return instance.resolveAsync().then((result) => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function),
                        fnAsync: jasmine.any(Function)
                    });
                });
            });
            it("adds an async method when true ", () => {
                instance.promisified(true);

                return instance.resolveAsync().then((result) => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function),
                        fnAsync: jasmine.any(Function)
                    });
                });
            });
            it("can disable promisification", () => {
                return instance.resolveAsync().then((result) => {
                    expect(result).toEqual({
                        fn: jasmine.any(Function)
                    });
                });
            });
        });
    });
});
