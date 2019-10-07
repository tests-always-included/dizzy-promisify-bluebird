import { default as Dizzy, DizzyProvider, BulkProvider } from 'dizzy';

export default function dizzyPromisifyBluebird(dizzy: typeof Dizzy): void;

declare module 'dizzy' {
    interface DizzyProvider {
        promisified(enable?: boolean): this
    }

    interface BulkProvider {
        promisified(enable?: boolean): this
    }
}
