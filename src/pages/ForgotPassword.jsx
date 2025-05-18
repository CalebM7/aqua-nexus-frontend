import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      // Placeholder for future backend integration
      // const response = await fetch('http://localhost:5000/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.error || 'Failed to send reset link');
      // }
      // Simulate success for now
      setMessage('If an account exists for this email, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 xl:w-3/5 bg-aqua-blue text-white p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden order-2 lg:order-1">
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8 flex items-center justify-center text-4xl font-bold">
            <i className="fas fa-tint mr-3 text-aqua-teal"></i>
            <span>AquaNexus</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
            Connecting Kenya to Trusted Water Solutions.
          </h1>
          <p className="text-lg text-blue-100">
            Find certified providers for rainwater harvesting and borehole drilling, or offer your services to those in need.
          </p>
        </div>
      </div>
      <div className="lg:w-1/2 xl:w-2/5 w-full bg-white p-6 md:p-12 flex items-center justify-center order-1 lg:order-2">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-aqua-blue mb-6">Reset Your Password</h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4" aria-live="assertive">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center mb-4" aria-live="assertive">
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="input-with-icon">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aqua-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-blue transition duration-150 ease-in-out disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Back to{' '}
              <Link to="/login" className="font-medium text-aqua-blue hover:text-aqua-teal">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;