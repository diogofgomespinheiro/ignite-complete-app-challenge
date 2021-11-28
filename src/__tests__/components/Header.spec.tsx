import { render, screen, fireEvent } from '@testing-library/react';

import { mockUseRouter } from '../../utils';
import Header from '../../components/Header';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Header', () => {
  it('should be able to render logo', () => {
    render(<Header />);

    screen.getByAltText('logo');
  });

  it('should be able to navigate to home page after a click', () => {
    const { push: pushSpy } = mockUseRouter({});
    render(<Header />);

    const secondLink = screen.getByAltText('logo');

    fireEvent.click(secondLink);

    expect(pushSpy).toHaveBeenCalledWith('/');
  });
});
