import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const STEPS = [
  { label: "Photo", icon: "📸" },
  { label: "Details", icon: "✏️" },
  { label: "Languages", icon: "🌍" },
  { label: "Location", icon: "📍" },
];

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated!");
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-slide-up">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                  ${i === currentStep
                    ? "bg-primary text-primary-content shadow-md"
                    : i < currentStep
                      ? "bg-success/20 text-success"
                      : "bg-base-200 opacity-50"
                  }
                `}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-colors duration-300 ${
                  i < currentStep ? "bg-success" : "bg-base-300"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl shadow-2xl">
          <div className="card-body p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Complete Your Profile</h1>
              <p className="text-sm opacity-50 mt-1">
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 0: Photo */}
              {currentStep === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
                  <div className="size-36 rounded-full bg-base-300 overflow-hidden ring-4 ring-primary/20 shadow-xl">
                    {formState.profilePic ? (
                      <img
                        src={formState.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-14 text-base-content opacity-30" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent rounded-xl gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <ShuffleIcon className="size-4" />
                    Generate Random Avatar
                  </button>
                </div>
              )}

              {/* Step 1: Name + Bio */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Full Name</span>
                    </label>
                    <div className="input-glow rounded-xl">
                      <input
                        type="text"
                        name="fullName"
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        className="input input-bordered w-full rounded-xl"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <div className="input-glow rounded-xl">
                      <textarea
                        name="bio"
                        value={formState.bio}
                        onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                        className="textarea textarea-bordered h-28 w-full rounded-xl"
                        placeholder="Tell others about yourself and your language learning goals"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Languages */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Native Language</span>
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                      className="select select-bordered w-full rounded-xl"
                    >
                      <option value="">Select your native language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Learning Language</span>
                    </label>
                    <select
                      name="learningLanguage"
                      value={formState.learningLanguage}
                      onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                      className="select select-bordered w-full rounded-xl"
                    >
                      <option value="">Select language you're learning</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Location</span>
                    </label>
                    <div className="relative input-glow rounded-xl">
                      <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-40" />
                      <input
                        type="text"
                        name="location"
                        value={formState.location}
                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                        className="input input-bordered w-full pl-10 rounded-xl"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  className={`btn btn-ghost rounded-xl ${currentStep === 0 ? 'invisible' : ''}`}
                  onClick={prevStep}
                >
                  ← Back
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary rounded-xl shadow-md hover:shadow-lg transition-all"
                    onClick={nextStep}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className="btn btn-primary rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    disabled={isPending}
                    type="submit"
                  >
                    {!isPending ? (
                      <>
                        <ShipWheelIcon className="size-5" />
                        Complete Onboarding
                      </>
                    ) : (
                      <>
                        <LoaderIcon className="animate-spin size-5" />
                        Onboarding...
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;