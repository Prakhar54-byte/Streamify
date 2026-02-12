import { useState } from 'react';
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from '../hooks/useLogin';

function LoginPage() {
  const [logInData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(logInData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 auth-bg" data-theme="forest">
      <div className="glass-card flex flex-col lg:flex-row w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-start gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-lg">
              <ShipWheelIcon className="size-8 text-primary-content" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight gradient-text">
              Streamify
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6 rounded-xl animate-fade-in">
              <span>{error.response?.data?.message || "An error occurred"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Welcome Back</h2>
                  <p className="text-sm opacity-60 mt-1">
                    Sign in to continue your language learning journey
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <div className="input-glow rounded-xl">
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className="input input-bordered w-full rounded-xl"
                        value={logInData.email}
                        onChange={(e) => setLoginData({ ...logInData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="input-glow rounded-xl">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full rounded-xl"
                        value={logInData.password}
                        onChange={(e) => setLoginData({ ...logInData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-sm opacity-70">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary font-semibold hover:underline">
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/5 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="max-w-md p-8 relative z-10">
            <div className="relative aspect-square max-w-sm mx-auto animate-float">
              <img src="/si.png" alt="Language connection illustration" className="w-full h-full drop-shadow-lg" />
            </div>

            <div className="text-center space-y-3 mt-8">
              <h2 className="text-xl font-bold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-60 text-sm leading-relaxed">
                Practice conversations, make friends, and improve your language skills through real-time video calls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;