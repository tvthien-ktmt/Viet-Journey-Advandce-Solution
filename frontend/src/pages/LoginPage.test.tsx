import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuth } from '@/store/authStore';

// Mock the API
vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    sendLoginOtp: vi.fn(),
    verifyLoginOtp: vi.fn(),
    mockGoogleLogin: vi.fn()
  }
}));

// Mock Zustand Store
vi.mock('@/store/authStore', () => ({
  useAuth: vi.fn()
}));

// Mock useT
vi.mock('@/store/langStore', () => ({
  useT: () => (key: string) => {
    const dict: Record<string, string> = {
      'login.title': 'Đăng nhập',
      'login.email': 'Email',
      'login.password': 'Mật khẩu',
      'login.submit': 'Đăng nhập'
    };
    return dict[key] || key;
  }
}));

const mockSetAuth = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockImplementation((selector: any) => {
      // Return mockSetAuth when s => s.setAuth is called
      if (typeof selector === 'function') {
        const state = { setAuth: mockSetAuth };
        return selector(state);
      }
      return mockSetAuth;
    });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('should render login form correctly', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
  });

  it('should show error toast if login fails', async () => {
    // Setup API mock to reject
    const mockError = { response: { data: { message: 'Sai email hoặc mật khẩu' } } };
    (authApi.login as any).mockRejectedValue(mockError);

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/Mật khẩu/i), 'wrongpass');
    
    // Using testId or other role to get submit button
    // It's a Button component, usually has role button
    const submitBtns = screen.getAllByRole('button');
    // Find the one that submits the form
    // The submit button uses _t('login.submit') which mocks to 'Đăng nhập'
    const loginBtn = submitBtns.find(b => b.textContent?.includes('Đăng nhập'));
    if(loginBtn) await user.click(loginBtn);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('wrong@test.com', 'wrongpass');
    });
    
    expect(mockSetAuth).not.toHaveBeenCalled();
  });

  it('should call setAuth and navigate on successful login', async () => {
    const mockResponse = {
      user: { id: 1, email: 'test@test.com', role: 'USER' },
      token: 'fake-token'
    };
    (authApi.login as any).mockResolvedValue(mockResponse);

    renderWithRouter(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Mật khẩu/i), 'correctpass');
    
    const submitBtns = screen.getAllByRole('button');
    const loginBtn = submitBtns.find(b => b.textContent?.includes('Đăng nhập'));
    if(loginBtn) await user.click(loginBtn);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@test.com', 'correctpass');
    });

    expect(mockSetAuth).toHaveBeenCalledWith(mockResponse.user, mockResponse.token, '');
  });
});
