import { useState } from 'react';
import { ShipWheelIcon } from "lucide-react";
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';

function SignUpPage() {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signupMutation, isPending, error } = useSignup();

  const handleSignup = async (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 20, label: "Weak", color: "bg-error" };
    if (strength <= 2) return { strength: 40, label: "Fair", color: "bg-warning" };
    if (strength <= 3) return { strength: 60, label: "Good", color: "bg-info" };
    if (strength <= 4) return { strength: 80, label: "Strong", color: "bg-success" };
    return { strength: 100, label: "Very Strong", color: "bg-success" };
  };

  const passwordInfo = getPasswordStrength(signupData.password);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 auth-bg"
      data-theme="forest"
    >
      <div className="glass-card flex flex-col lg:flex-row w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Sign Up Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-lg">
              <ShipWheelIcon className="size-8 text-primary-content" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight gradient-text">
              Streamify
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4 rounded-xl animate-fade-in">
              <span>{error.response?.data?.message || "An error occurred"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold">Create an Account</h2>
                <p className="text-sm opacity-60 mt-1">
                  Join Streamify and start your language learning adventure!
                </p>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="input-glow rounded-xl">
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full rounded-xl"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="input-glow rounded-xl">
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full rounded-xl"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="input-glow rounded-xl">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full rounded-xl"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                  {/* Password Strength */}
                  {signupData.password && (
                    <div className="mt-2 animate-fade-in">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs opacity-60">Password strength</span>
                        <span className="text-xs font-medium">{passwordInfo.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${passwordInfo.color}`}
                          style={{ width: `${passwordInfo.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" required />
                    <span className="text-xs leading-tight opacity-70">
                      I agree to the{" "}
                      <span className="text-primary hover:underline cursor-pointer">terms of service</span> and{" "}
                      <span className="text-primary hover:underline cursor-pointer">privacy policy</span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary w-full rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm opacity-70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
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
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;