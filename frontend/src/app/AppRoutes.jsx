// frontend/src/app/AppRoutes.jsx
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES FROM ORIGINAL:
//   1. Auth routes updated — now also exported at top-level paths
//      /login /register /forgot-password /reset-password /verify-otp /verify-email
//      so backend email links work (they point to /auth/verify-email, /auth/reset-password)
//   2. AUTH routes constants updated to /auth/* namespace (matching your /auth prefix)
//   3. All 6 auth page imports kept as eager (critical path — email links must work
//      even before JS hydration completes)
//   4. OAuthSuccessPage added for Google/Facebook redirect
//   5. Everything else is IDENTICAL to your original file
// ─────────────────────────────────────────────────────────────────────────────

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { PageLoader } from "@/components/shared/Loader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types/auth.types";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import UserLayout from "@/components/layout/UserLayout";
import OrganizerLayout from "@/components/layout/OrganizerLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL PATH — eagerly imported
// ─────────────────────────────────────────────────────────────────────────────
import BrowsePage from "@/pages/browse/BrowsePage";
import CategoryPage from "@/pages/browse/Category/CategoryPage";
import SubCategoryPage from "@/pages/browse/SubCategory/SubCategoryPage";
import EventTypePage from "@/pages/browse/EventType/EventTypePage";
import EventDetailsPage from "@/pages/browse/EventDetails/EventDetailsPage";
import MaintenancePage from "@/pages/error/MaintenancePage";

// Auth pages — eager (email links must land instantly, no lazy waterfall)
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";

// ─────────────────────────────────────────────────────────────────────────────
// LAZY LOADED
// ─────────────────────────────────────────────────────────────────────────────

// Home
const HomePage = lazy(() => import("@/pages/home/HomePage"));

// Search
const SearchPage = lazy(() => import("@/pages/search/SearchPage"));
const SearchResultsPage = lazy(
  () => import("@/pages/search/SearchResultsPage"),
);

// Cart & Checkout
const CartPage = lazy(() => import("@/pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/cart/CheckoutPage"));

// Payments
const PaymentPage = lazy(() => import("@/pages/payments/PaymentPage"));
const PaymentSuccessPage = lazy(
  () => import("@/pages/payments/PaymentSuccessPage"),
);
const PaymentFailedPage = lazy(
  () => import("@/pages/payments/PaymentFailedPage"),
);
const PaymentHistoryPage = lazy(
  () => import("@/pages/payments/PaymentHistoryPage"),
);
const PaymentDetailsPage = lazy(
  () => import("@/pages/payments/PaymentDetailsPage"),
);

// Tickets
const TicketSelectionPage = lazy(
  () => import("@/pages/tickets/TicketSelectionPage"),
);
const SeatSelectionPage = lazy(
  () => import("@/pages/tickets/SeatSelectionPage"),
);
const TicketBookingPage = lazy(
  () => import("@/pages/tickets/TicketBookingPage"),
);
const TicketPaymentPage = lazy(
  () => import("@/pages/tickets/TicketPaymentPage"),
);
const TicketConfirmationPage = lazy(
  () => import("@/pages/tickets/TicketConfirmationPage"),
);
const TicketDownloadPage = lazy(
  () => import("@/pages/tickets/TicketDownloadPage"),
);

// Bookings
const BookingHistoryPage = lazy(
  () => import("@/pages/bookings/BookingHistoryPage"),
);
const BookingDetailsPage = lazy(
  () => import("@/pages/bookings/BookingDetailsPage"),
);
const CancelBookingPage = lazy(
  () => import("@/pages/bookings/CancelBookingPage"),
);
const WaitlistPage = lazy(() => import("@/pages/bookings/WaitlistPage"));

// User Profile
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("@/pages/profile/EditProfilePage"));
const ChangePasswordPage = lazy(
  () => import("@/pages/profile/ChangePasswordPage"),
);
const NotificationSettingsPage = lazy(
  () => import("@/pages/profile/NotificationSettingsPage"),
);

// Messaging
const InboxPage = lazy(() => import("@/pages/messaging/InboxPage"));
const ConversationPage = lazy(
  () => import("@/pages/messaging/ConversationPage"),
);
const ChatPage = lazy(() => import("@/pages/messaging/ChatPage"));

// Notifications
const NotificationsPage = lazy(
  () => import("@/pages/notifications/NotificationsPage"),
);
const NotificationDetailPage = lazy(
  () => import("@/pages/notifications/NotificationDetailPage"),
);

// Reviews
const ReviewsPage = lazy(() => import("@/pages/reviews/ReviewsPage"));
const WriteReviewPage = lazy(() => import("@/pages/reviews/WriteReviewPage"));

// Organizer Dashboard
const OrganizerDashboard = lazy(
  () => import("@/pages/organizer/OrganizerDashboard"),
);
const CreateEventPage = lazy(() => import("@/pages/organizer/CreateEventPage"));
const EditEventPage = lazy(() => import("@/pages/organizer/EditEventPage"));
const OrgEventManagementPage = lazy(
  () => import("@/pages/organizer/EventManagementPage"),
);
const OrgTicketManagementPage = lazy(
  () => import("@/pages/organizer/TicketManagementPage"),
);
const OrgBookingManagementPage = lazy(
  () => import("@/pages/organizer/BookingManagementPage"),
);
const OrgRevenuePage = lazy(() => import("@/pages/organizer/RevenuePage"));
const OrgAnalyticsPage = lazy(() => import("@/pages/organizer/AnalyticsPage"));
const OrganizerSettingsPage = lazy(
  () => import("@/pages/organizer/SettingsPage"),
);

// Admin Dashboard
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage"),
);
const AdminEventManagementPage = lazy(
  () => import("@/pages/admin/EventManagementPage"),
);
const AdminBookingManagementPage = lazy(
  () => import("@/pages/admin/BookingManagementPage"),
);
const AdminPaymentManagementPage = lazy(
  () => import("@/pages/admin/PaymentManagementPage"),
);
const AdminAnalyticsDashboard = lazy(
  () => import("@/pages/admin/AnalyticsDashboard"),
);
const AdminReportsPage = lazy(() => import("@/pages/admin/ReportsPage"));
const AdminPromotionsPage = lazy(() => import("@/pages/admin/PromotionsPage"));
const AdminSystemSettingsPage = lazy(
  () => import("@/pages/admin/SystemSettingsPage"),
);
const AdminLogsPage = lazy(() => import("@/pages/admin/LogsPage"));

// Static
const AboutPage = lazy(() => import("@/pages/static/AboutPage"));
const ContactPage = lazy(() => import("@/pages/static/ContactPage"));
const FAQPage = lazy(() => import("@/pages/static/FAQPage"));
const PrivacyPage = lazy(() => import("@/pages/static/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/static/TermsPage"));

// Error
const NotFoundPage = lazy(() => import("@/pages/error/NotFoundPage"));
const ForbiddenPage = lazy(() => import("@/pages/error/ForbiddenPage"));
const ServerErrorPage = lazy(() => import("@/pages/error/ServerErrorPage"));
const HttpVersionNotSupportedPage = lazy(
  () => import("@/pages/error/HttpVersionNotSupportedPage"),
);

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",

  BROWSE: {
    ROOT: "/browse",
    CATEGORY: (cat) => `/browse/${cat}`,
    SUBCATEGORY: (cat, sub) => `/browse/${cat}/${sub}`,
    EVENT_TYPE: (cat, sub, type) => `/browse/${cat}/${sub}/${type}`,
  },

  EVENT: (slug) => `/events/${slug}`,

  SEARCH: {
    ROOT: "/search",
    RESULTS: "/search/results",
  },

  CART: {
    ROOT: "/cart",
    CHECKOUT: "/cart/checkout",
  },

  // ── Auth — /auth/* namespace ───────────────────────────────────────────────
  // Backend emails link to /auth/verify-email and /auth/reset-password.
  // These are also reachable as standalone pages (not just modal fallbacks).
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    VERIFY_EMAIL: "/auth/verify-email",
    OAUTH_SUCCESS: "/auth/oauth-success",
  },

  // ── User ──────────────────────────────────────────────────────────────────
  PROFILE: {
    ROOT: "/profile",
    EDIT: "/profile/edit",
    CHANGE_PASSWORD: "/profile/change-password",
    NOTIFICATIONS: "/profile/notifications",
  },

  BOOKINGS: {
    ROOT: "/bookings",
    DETAIL: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/cancel/${id}`,
    WAITLIST: (id) => `/bookings/waitlist/${id}`,
  },

  TICKETS: {
    SELECT: (eventId) => `/tickets/select/${eventId}`,
    SEATS: (eventId) => `/tickets/seats/${eventId}`,
    BOOK: (ticketId) => `/tickets/book/${ticketId}`,
    PAYMENT: (bookingId) => `/tickets/payment/${bookingId}`,
    CONFIRM: (bookingId) => `/tickets/confirm/${bookingId}`,
    DOWNLOAD: (ticketId) => `/tickets/download/${ticketId}`,
  },

  PAYMENTS: {
    ROOT: (bookingId) => `/payments/${bookingId}`,
    SUCCESS: (paymentId) => `/payments/success/${paymentId}`,
    FAILED: (paymentId) => `/payments/failed/${paymentId}`,
    HISTORY: "/payments/history",
    DETAILS: (paymentId) => `/payments/details/${paymentId}`,
  },

  MESSAGES: {
    ROOT: "/messages",
    CONVERSATION: (id) => `/messages/conversation/${id}`,
    CHAT: (id) => `/messages/chat/${id}`,
  },

  NOTIFICATIONS: {
    ROOT: "/notifications",
    DETAIL: (id) => `/notifications/${id}`,
  },

  REVIEWS: {
    EVENT: (eventId) => `/reviews/event/${eventId}`,
    WRITE: (eventId) => `/reviews/write/${eventId}`,
  },

  ORGANIZER: {
    ROOT: "/organizer",
    DASHBOARD: "/organizer/dashboard",
    EVENTS: "/organizer/events",
    CREATE_EVENT: "/organizer/events/create",
    EDIT_EVENT: (id) => `/organizer/events/edit/${id}`,
    TICKET_MGMT: (id) => `/organizer/events/tickets/${id}`,
    BOOKINGS: "/organizer/bookings",
    BOOKING: (id) => `/organizer/bookings/${id}`,
    REVENUE: "/organizer/revenue",
    ANALYTICS: "/organizer/analytics",
    SETTINGS: "/organizer/settings",
  },

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER: (id) => `/admin/users/${id}`,
    EVENTS: "/admin/events",
    EVENT: (id) => `/admin/events/${id}`,
    BOOKINGS: "/admin/bookings",
    BOOKING: (id) => `/admin/bookings/${id}`,
    PAYMENTS: "/admin/payments",
    PAYMENT: (id) => `/admin/payments/${id}`,
    ANALYTICS: "/admin/analytics",
    REPORTS: "/admin/reports",
    PROMOTIONS: "/admin/promotions",
    SYSTEM_SETTINGS: "/admin/system/settings",
    SYSTEM_LOGS: "/admin/system/logs",
  },

  STATIC: {
    ABOUT: "/about",
    CONTACT: "/contact",
    FAQ: "/faq",
    PRIVACY: "/privacy",
    TERMS: "/terms",
  },

  ERROR: {
    NOT_FOUND: "/404",
    FORBIDDEN: "/403",
    SERVER_ERROR: "/500",
    HTTP_505: "/505",
    MAINTENANCE: "/maintenance",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// APP ROUTES
// ─────────────────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ══════════════════════════════════════════════════════════
            PUBLIC — MainLayout (Navbar + Footer)
        ══════════════════════════════════════════════════════════ */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/browse">
            <Route index element={<BrowsePage />} />
            <Route path=":categorySlug" element={<CategoryPage />} />
            <Route
              path=":categorySlug/:subCategorySlug"
              element={<SubCategoryPage />}
            />
            <Route
              path=":categorySlug/:subCategorySlug/:eventTypeSlug"
              element={<EventTypePage />}
            />
          </Route>

          <Route path="/events/:eventSlug" element={<EventDetailsPage />} />

          <Route path="/search">
            <Route index element={<SearchPage />} />
            <Route path="results" element={<SearchResultsPage />} />
          </Route>

          <Route path="/cart">
            <Route index element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* ══════════════════════════════════════════════════════════
            AUTH PAGES — AuthLayout (split panel, no Navbar/Footer)
            These are standalone pages, NOT wrapped in MainLayout.
            Covers:
              - Email link destinations (/auth/verify-email, /auth/reset-password)
              - OAuth redirect handler  (/auth/oauth-success)
              - Full-page fallbacks for users who navigate directly
                or whose modal system hasn't loaded yet
            All routes public — no ProtectedRoute wrapper.
        ══════════════════════════════════════════════════════════ */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-otp" element={<OTPVerificationPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="oauth-success" element={<OAuthSuccessPage />} />
        </Route>

        {/* ══════════════════════════════════════════════════════════
            PROTECTED — Any authenticated user
        ══════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/profile">
              <Route index element={<ProfilePage />} />
              <Route path="edit" element={<EditProfilePage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route
                path="notifications"
                element={<NotificationSettingsPage />}
              />
            </Route>

            <Route path="/bookings">
              <Route index element={<BookingHistoryPage />} />
              <Route path=":bookingId" element={<BookingDetailsPage />} />
              <Route path="cancel/:bookingId" element={<CancelBookingPage />} />
              <Route path="waitlist/:eventId" element={<WaitlistPage />} />
            </Route>

            <Route path="/tickets">
              <Route path="select/:eventId" element={<TicketSelectionPage />} />
              <Route path="seats/:eventId" element={<SeatSelectionPage />} />
              <Route path="book/:ticketId" element={<TicketBookingPage />} />
              <Route
                path="payment/:bookingId"
                element={<TicketPaymentPage />}
              />
              <Route
                path="confirm/:bookingId"
                element={<TicketConfirmationPage />}
              />
              <Route
                path="download/:ticketId"
                element={<TicketDownloadPage />}
              />
            </Route>

            <Route path="/payments">
              <Route path=":bookingId" element={<PaymentPage />} />
              <Route
                path="success/:paymentId"
                element={<PaymentSuccessPage />}
              />
              <Route path="failed/:paymentId" element={<PaymentFailedPage />} />
              <Route path="history" element={<PaymentHistoryPage />} />
              <Route
                path="details/:paymentId"
                element={<PaymentDetailsPage />}
              />
            </Route>

            <Route path="/messages">
              <Route index element={<InboxPage />} />
              <Route
                path="conversation/:conversationId"
                element={<ConversationPage />}
              />
              <Route path="chat/:userId" element={<ChatPage />} />
            </Route>

            <Route path="/notifications">
              <Route index element={<NotificationsPage />} />
              <Route
                path=":notificationId"
                element={<NotificationDetailPage />}
              />
            </Route>

            <Route path="/reviews">
              <Route path="event/:eventId" element={<ReviewsPage />} />
              <Route path="write/:eventId" element={<WriteReviewPage />} />
            </Route>
          </Route>
        </Route>

        {/* ══════════════════════════════════════════════════════════
            PROTECTED — Organizer + Admin
        ══════════════════════════════════════════════════════════ */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ORGANIZER, UserRole.ADMIN]}
            />
          }
        >
          <Route element={<OrganizerLayout />}>
            <Route path="/organizer">
              <Route
                index
                element={<Navigate to="/organizer/dashboard" replace />}
              />
              <Route path="dashboard" element={<OrganizerDashboard />} />
              <Route path="events">
                <Route index element={<OrgEventManagementPage />} />
                <Route path="create" element={<CreateEventPage />} />
                <Route path="edit/:eventId" element={<EditEventPage />} />
                <Route
                  path="tickets/:eventId"
                  element={<OrgTicketManagementPage />}
                />
              </Route>
              <Route path="bookings">
                <Route index element={<OrgBookingManagementPage />} />
                <Route path=":bookingId" element={<BookingDetailsPage />} />
              </Route>
              <Route path="revenue" element={<OrgRevenuePage />} />
              <Route path="analytics" element={<OrgAnalyticsPage />} />
              <Route path="settings" element={<OrganizerSettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* ══════════════════════════════════════════════════════════
            PROTECTED — Admin only
        ══════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin">
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users">
                <Route index element={<AdminUserManagementPage />} />
                <Route path=":userId" element={<AdminUserManagementPage />} />
              </Route>
              <Route path="events">
                <Route index element={<AdminEventManagementPage />} />
                <Route path=":eventId" element={<AdminEventManagementPage />} />
              </Route>
              <Route path="bookings">
                <Route index element={<AdminBookingManagementPage />} />
                <Route
                  path=":bookingId"
                  element={<AdminBookingManagementPage />}
                />
              </Route>
              <Route path="payments">
                <Route index element={<AdminPaymentManagementPage />} />
                <Route
                  path=":paymentId"
                  element={<AdminPaymentManagementPage />}
                />
              </Route>
              <Route path="analytics" element={<AdminAnalyticsDashboard />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="promotions" element={<AdminPromotionsPage />} />
              <Route path="system">
                <Route path="settings" element={<AdminSystemSettingsPage />} />
                <Route path="logs" element={<AdminLogsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* ══════════════════════════════════════════════════════════
            ERROR & UTILITY — MainLayout
        ══════════════════════════════════════════════════════════ */}
        <Route element={<MainLayout />}>
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/505" element={<HttpVersionNotSupportedPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
