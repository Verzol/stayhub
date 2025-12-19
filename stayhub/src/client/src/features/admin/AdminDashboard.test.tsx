import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

test('renders Admin Dashboard', () => {
    render(<AdminDashboard />);
    const heading = screen.getByText(/Admin Dashboard/i);
    expect(heading).toBeInTheDocument();
});

test('handles user interaction', () => {
    render(<AdminDashboard />);
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    const message = screen.getByText(/submitted successfully/i);
    expect(message).toBeInTheDocument();
});