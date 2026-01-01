import { render, screen } from '@testing-library/react';
import Header from '../Header';

test('renders header and links', () => {
  render(<Header />);
  expect(screen.getByText(/CertifyNFT Admin/i)).toBeInTheDocument();
  expect(screen.getByText(/Mint/i)).toBeInTheDocument();
  expect(screen.getByText(/Admins/i)).toBeInTheDocument();
});
