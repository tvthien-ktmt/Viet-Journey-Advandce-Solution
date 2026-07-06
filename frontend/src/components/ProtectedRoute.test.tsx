
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../store/authStore';

// Mục đích test: Đảm bảo route guard hoạt động đúng, tự redirect nếu chưa đăng nhập.
// Tại sao quan trọng: Vấn đề cốt lõi của Security FE.
describe('ProtectedRoute', () => {
  it('should redirect to login if not authenticated', () => {
    useAuth.setState({ token: null, user: null }); // Force unauth

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page Mock</div>} />
          <Route path="/protected" element={<ProtectedRoute><div>Secret Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Mock')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('should render content if authenticated', () => {
    useAuth.setState({ token: 'fake_token', user: { id: '1', email: 'a@a.com', fullName: 'A', roles: ['USER'] } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Secret Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
