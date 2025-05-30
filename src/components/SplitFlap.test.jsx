import { render, screen, act } from '@testing-library/react';
import SplitFlap from './SplitFlap';

describe('SplitFlap', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders empty when no text provided', () => {
    render(<SplitFlap />);
    expect(screen.queryByClassName('flap')).not.toBeInTheDocument();
  });

  it('displays characters progressively', () => {
    render(<SplitFlap text="Hello" duration={100} />);
    
    // Initially no characters
    expect(screen.queryByText('H')).not.toBeInTheDocument();
    
    // After 100ms, first character appears
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('H')).toBeInTheDocument();
    
    // After 200ms, second character appears
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('e')).toBeInTheDocument();
    
    // Continue for all characters
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('l')).toBeInTheDocument();
    expect(screen.getByText('o')).toBeInTheDocument();
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<SplitFlap text="Test" duration={100} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('resets when text changes', () => {
    const { rerender } = render(<SplitFlap text="ABC" duration={50} />);
    
    // Display first text
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    
    // Change text
    rerender(<SplitFlap text="XYZ" duration={50} />);
    
    // Old text should be gone
    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    
    // New text appears progressively
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<SplitFlap text="Hi" duration={50} />);
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    const flaps = screen.getAllByClassName('flap');
    expect(flaps).toHaveLength(2);
    expect(flaps[0]).toHaveTextContent('H');
    expect(flaps[1]).toHaveTextContent('i');
  });

  it('does not re-render when same props are passed', () => {
    const renderSpy = jest.fn();
    
    // Wrap component to spy on renders
    const TestWrapper = (props) => {
      renderSpy();
      return <SplitFlap {...props} />;
    };
    
    const { rerender } = render(<TestWrapper text="Test" duration={100} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with same props
    rerender(<TestWrapper text="Test" duration={100} />);
    expect(renderSpy).toHaveBeenCalledTimes(1); // Should not increase due to memo
    
    // Re-render with different props
    rerender(<TestWrapper text="Test2" duration={100} />);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});