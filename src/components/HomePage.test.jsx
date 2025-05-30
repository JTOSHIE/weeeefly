import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

// Mock the SplitFlap component
jest.mock('./SplitFlap', () => ({
  __esModule: true,
  default: ({ text }) => <div data-testid="split-flap">{text}</div>
}));

describe('HomePage', () => {
  it('renders the form with all fields', () => {
    render(<HomePage />);
    
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/depart date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    const submitButton = screen.getByRole('button', { name: /search flights/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/origin is required/i)).toBeInTheDocument();
      expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
      expect(screen.getByText(/departure date is required/i)).toBeInTheDocument();
    });
  });

  it('validates that destination is different from origin', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    const originInput = screen.getByLabelText(/origin/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    
    await user.type(originInput, 'JFK');
    await user.type(destinationInput, 'JFK');
    
    const submitButton = screen.getByRole('button', { name: /search flights/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/destination must be different from origin/i)).toBeInTheDocument();
    });
  });

  it('validates date fields correctly', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    const departDateInput = screen.getByLabelText(/depart date/i);
    const returnDateInput = screen.getByLabelText(/return date/i);
    
    // Set past date for departure
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    fireEvent.change(departDateInput, { target: { value: yesterdayStr } });
    
    const submitButton = screen.getByRole('button', { name: /search flights/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/departure date must be in the future/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Fill in valid form data
    await user.type(screen.getByLabelText(/origin/i), 'JFK');
    await user.type(screen.getByLabelText(/destination/i), 'LAX');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/depart date/i), { 
      target: { value: tomorrowStr } 
    });
    
    const submitButton = screen.getByRole('button', { name: /search flights/i });
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/searching/i);
  });

  it('clears field error when user types', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    
    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /search flights/i });
    await user.click(submitButton);
    
    // Verify error is shown
    await waitFor(() => {
      expect(screen.getByText(/origin is required/i)).toBeInTheDocument();
    });
    
    // Type in the field
    const originInput = screen.getByLabelText(/origin/i);
    await user.type(originInput, 'J');
    
    // Error should be cleared
    expect(screen.queryByText(/origin is required/i)).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HomePage />);
    
    const form = screen.getByRole('form', { name: /flight search form/i });
    expect(form).toHaveAttribute('novalidate');
    
    const originInput = screen.getByLabelText(/origin/i);
    expect(originInput).toHaveAttribute('aria-required', 'true');
    expect(originInput).toHaveAttribute('aria-label', 'Origin airport or city');
  });
});