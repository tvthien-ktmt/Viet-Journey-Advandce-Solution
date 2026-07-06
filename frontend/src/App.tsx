import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { PageLoader } from '@/components/common/PageLoader';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Main Pages
import HomePage from '@/pages/HomePage';
const AddonsPage = lazy(() => import('@/pages/AddonsPage'));
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BookingDetailPage = lazy(() => import('@/pages/BookingDetailPage'));
const BookingExpiredPage = lazy(() => import('@/pages/BookingExpiredPage'));
const BookingHistoryPage = lazy(() => import('@/pages/BookingHistoryPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const ChangeFlightPage = lazy(() => import('@/pages/ChangeFlightPage'));
const CheckinPage = lazy(() => import('@/pages/CheckinPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DestinationDetailPage = lazy(() => import('@/pages/DestinationDetailPage'));
const DestinationsPage = lazy(() => import('@/pages/DestinationsPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const FlightResultsPage = lazy(() => import('@/pages/FlightResultsPage'));
const FlightSchedulePage = lazy(() => import('@/pages/FlightSchedulePage'));
const FlightStatusPage = lazy(() => import('@/pages/FlightStatusPage'));
const FlightsPage = lazy(() => import('@/pages/FlightsPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const HotelDetailPage = lazy(() => import('@/pages/HotelDetailPage'));
const HotelsPage = lazy(() => import('@/pages/HotelsPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const LotusmilesPage = lazy(() => import('@/pages/LotusmilesPage'));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage'));
const ManageBookingPage = lazy(() => import('@/pages/ManageBookingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const PaymentFailedPage = lazy(() => import('@/pages/PaymentFailedPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const RefundPage = lazy(() => import('@/pages/RefundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const SeatHoldPage = lazy(() => import('@/pages/SeatHoldPage'));
const SeatSelectionPage = lazy(() => import('@/pages/SeatSelectionPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));
const TourDetailPage = lazy(() => import('@/pages/TourDetailPage'));
const ToursPage = lazy(() => import('@/pages/ToursPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminFlightsPage = lazy(() => import('@/pages/admin/AdminFlightsPage'));
const AdminBookingsPage = lazy(() => import('@/pages/admin/AdminBookingsPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminNewsPage = lazy(() => import('@/pages/admin/AdminNewsPage'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main App Layout */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/booking-expired" element={<BookingExpiredPage />} />
            <Route path="/change-flight" element={<ChangeFlightPage />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/destination/:id" element={<DestinationDetailPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/flights/results" element={<FlightResultsPage />} />
            <Route path="/flight-schedule" element={<FlightSchedulePage />} />
            <Route path="/flight-status" element={<FlightStatusPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lotusmiles" element={<LotusmilesPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/manage-booking" element={<ManageBookingPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />
            <Route path="/tour/:id" element={<TourDetailPage />} />
            <Route path="/tours" element={<ToursPage />} />
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute roles={['USER', 'ADMIN']} />}>
              <Route path="/addons" element={<AddonsPage />} />
              <Route path="/booking/:id" element={<BookingDetailPage />} />
              <Route path="/booking-history" element={<BookingHistoryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/seat-hold/:bookingId" element={<SeatHoldPage />} />
              <Route path="/seat-selection" element={<SeatSelectionPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="flights" element={<AdminFlightsPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="news" element={<AdminNewsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
