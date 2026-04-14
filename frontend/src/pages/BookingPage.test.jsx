import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import BookingPage from './BookingPage';
import api from '../services/api';
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ serviceId: '1' }),
    useNavigate: () => vi.fn(),
  };
});

const mockUser = {
  userId: 1,
  name: 'John Doe',
  email: 'john@test.com',
  role: 'USER'
};

const mockService = {
  serviceId: 1,
  serviceName: 'Driving Licence',
  description: 'Apply for or renew your driving licence'
};

const mockCentres = [
  {
    centreId: 1,
    centreName: 'NDLS Dublin',
    address: '123 Main St, Dublin'
  }
];

const mockSlots = [
  {
    slotId: 1,
    startTime: '2026-04-10T09:00:00',
    endTime: '2026-04-10T09:30:00',
    availabilityStatus: 'AVAILABLE'
  }
];

describe('BookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('user', JSON.stringify(mockUser));
  });

  test('loads service and centres on mount', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/services') {
        return Promise.resolve({ data: [mockService] });
      }
      if (url.includes('/centres/service/')) {
        return Promise.resolve({ data: mockCentres });
      }
      if (url.includes('/slots/available/')) {
        return Promise.resolve({ data: mockSlots });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Driving Licence/i)).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/services');
    expect(api.get).toHaveBeenCalledWith('/centres/service/1');
  });
});
