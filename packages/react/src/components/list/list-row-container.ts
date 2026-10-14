import { createContext } from 'react';

/**
 * The element a ListRow renders as: an `li` in a ListGroup's list, a `div`
 * anywhere else, such as a ListGroup's `footer`.
 */
export const ListRowContainer = createContext<'li' | 'div'>('div');
