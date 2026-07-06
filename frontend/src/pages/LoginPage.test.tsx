
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { vi } from 'vitest';
import { useAuth } from '@/store/authStore';
import { authApi } from '@/api/auth';

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
  }
}));

// Mục đích test: Đảm bảo form Login demo UI hoạt động đúng.
describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate as admin on specific credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Nhập email hoặc số thẻ');
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'admin@vna.com');
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'admin');

    // Setup mock behavior
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'fake-admin-token',
          user: { id: '1', email: 'admin@vna.com', roles: ['ADMIN'] }
        }
      }
    });

    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));



    await waitFor(() => {
      const state = useAuth.getState();
      expect(state.user?.email).toBe('admin@vna.com');
      expect(state.user?.roles).toContain('ADMIN');
    });
  });

  it('should authenticate as normal user on other credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Nhập email hoặc số thẻ');
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu');

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'pass123');

    // Setup mock behavior
    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'fake-user-token',
          user: { id: '2', email: 'test@example.com', roles: ['USER'] }
        }
      }
    });

    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));



    await waitFor(() => {
      const state = useAuth.getState();
      expect(state.user?.email).toBe('test@example.com');
      expect(state.user?.roles).toContain('USER');
    });
  });
});
