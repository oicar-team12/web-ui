import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import UserAgreement from '../UserAgreement';

// Mock the useNavigate hook
const mockNavigate = jest.fn();

// Mock the react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserAgreement Component', () => {
  // Mock functions
  const mockOnAccept = jest.fn();
  const mockOnReject = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    window.localStorage.clear();
  });

  test('renders the user agreement title and content', () => {
    render(
      <Router>
        <UserAgreement onAccept={mockOnAccept} />
      </Router>
    );

    // Check if the main heading is rendered
    expect(screen.getByText('User Agreement')).toBeInTheDocument();
    
    // Check if the welcome message is present
    expect(screen.getByText(/Welcome to ShiftSync/)).toBeInTheDocument();
    
    // Check if section headers are present
    expect(screen.getByText('1. Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('2. Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('3. Data Usage')).toBeInTheDocument();
  });

  test('calls onAccept when "I Agree" button is clicked', () => {
    render(
      <Router>
        <UserAgreement onAccept={mockOnAccept} />
      </Router>
    );

    // Find and click the "I Agree" button
    const agreeButton = screen.getByRole('button', { name: /i agree/i });
    fireEvent.click(agreeButton);

    // Verify onAccept was called
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  test('navigates to home page when "Disagree" is clicked without onReject prop', () => {
    render(
      <Router>
        <UserAgreement onAccept={mockOnAccept} />
      </Router>
    );

    // Find and click the "Disagree" button
    const disagreeButton = screen.getByRole('button', { name: /disagree/i });
    fireEvent.click(disagreeButton);

    // Verify navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('calls onReject when provided and "Disagree" is clicked', () => {
    render(
      <Router>
        <UserAgreement onAccept={mockOnAccept} onReject={mockOnReject} />
      </Router>
    );

    // Find and click the "Disagree" button
    const disagreeButton = screen.getByRole('button', { name: /disagree/i });
    fireEvent.click(disagreeButton);

    // Verify onReject was called and navigation didn't occur
    expect(mockOnReject).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays the agreement notice in a highlighted box', () => {
    render(
      <Router>
        <UserAgreement onAccept={mockOnAccept} />
      </Router>
    );

    // Check if the notice box is present with the correct content
    const noticeText = screen.getByText(/By clicking "I Agree"/);
    expect(noticeText).toBeInTheDocument();
    
    // The notice box should be inside a div with specific classes
    const noticeBox = noticeText.closest('div');
    expect(noticeBox).not.toBeNull();
    
    if (noticeBox) {
      expect(noticeBox.className).toContain('bg-blue-50');
      expect(noticeBox.className).toContain('rounded-md');
    }
  });
});
