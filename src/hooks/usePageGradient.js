import { useLocation } from 'react-router-dom';

export function usePageGradient() {
  const location = useLocation();

  const getGradient = () => {
    const path = location.pathname;

    // Define gradients for each page
    const gradients = {
      '/': 'from-blue-600 to-indigo-700', // Home page
      '/about': 'from-blue-600 to-purple-600', // About page
      '/contact': 'from-green-600 to-blue-600', // Contact page
      '/myspace': 'from-blue-600 to-indigo-700', // MySpace (logged in home)
      '/search': 'from-blue-600 to-indigo-700', // Search page
      '/profile': 'from-blue-600 to-indigo-700', // Profile page
      '/settings': 'from-blue-600 to-indigo-700', // Settings page
      '/referrals': 'from-blue-600 to-indigo-700', // Referrals page
      '/register': 'from-blue-600 to-indigo-700', // Register page
      '/login': 'from-blue-600 to-indigo-700', // Login page
      '/forgotpassword': 'from-blue-600 to-indigo-700', // Forgot password page
      '/delete': 'from-blue-600 to-indigo-700', // Delete account page
      '/change-password': 'from-blue-600 to-indigo-700', // Change password page
      '/privacy': 'from-blue-600 to-indigo-700', // Privacy page
      '/terms': 'from-blue-600 to-indigo-700', // Terms page
      '/addons': 'from-blue-600 to-indigo-700', // Addons page
      '/photos': 'from-blue-600 to-indigo-700', // Photos page
      '/location': 'from-blue-600 to-indigo-700', // Location page
      '/cancellation': 'from-blue-600 to-indigo-700', // Cancellation page
      '/verify': 'from-blue-600 to-indigo-700', // Verify page
    };

    return gradients[path] || 'from-blue-600 to-indigo-700'; // Default fallback
  };

  return getGradient();
}