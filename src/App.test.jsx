import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock lazy loading
vi.mock('./components/HomePage', () => ({
  default: () => <div>HomePage Component</div>
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads HomePage component', async () => {
    render(<App />);
    const homePage = await screen.findByText('HomePage Component');
    expect(homePage).toBeInTheDocument();
  });
});