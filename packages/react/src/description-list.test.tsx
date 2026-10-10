import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DescriptionItem,
  DescriptionList,
} from './components/DescriptionList.js';

afterEach(() => cleanup());

describe('DescriptionList', () => {
  it('renders a dl whose items group each dt with its dd', () => {
    const { container } = render(
      <DescriptionList aria-label="Survey">
        <DescriptionItem term="Wetland">12 herons</DescriptionItem>
        <DescriptionItem term="Forest">
          <span>3 owls</span>
          <span>Recounted</span>
        </DescriptionItem>
      </DescriptionList>,
    );
    const list = container.querySelector('dl');
    expect(list?.className).toBe('sw-description-list');
    expect(list?.getAttribute('aria-label')).toBe('Survey');
    const items = container.querySelectorAll('dl > div.sw-description-item');
    expect(items).toHaveLength(2);
    const [first, second] = Array.from(items);
    expect(first.querySelector('dt.sw-description-term')?.textContent).toBe(
      'Wetland',
    );
    expect(first.querySelector('dd.sw-description-detail')?.textContent).toBe(
      '12 herons',
    );
    expect(within(second as HTMLElement).getByText('Recounted')).toBeTruthy();
    expect(screen.getAllByRole('term')).toHaveLength(2);
    expect(screen.getAllByRole('definition')).toHaveLength(2);
  });

  it('keeps a consumer class and attributes on the list and the item', () => {
    const { container } = render(
      <DescriptionList className="extra" id="survey">
        <DescriptionItem className="row" data-key="wetland" term="Wetland">
          12 herons
        </DescriptionItem>
      </DescriptionList>,
    );
    const list = container.querySelector('dl');
    expect(list?.className).toBe('sw-description-list extra');
    expect(list?.id).toBe('survey');
    const item = container.querySelector('.sw-description-item');
    expect(item?.className).toBe('sw-description-item row');
    expect(item?.getAttribute('data-key')).toBe('wetland');
  });
});
