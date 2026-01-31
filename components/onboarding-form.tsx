"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";

function formatSupabaseError(err: unknown) {
  if (!err) return "Unknown error";

  // Supabase/PostgREST errors are often plain objects, not instances of Error
  const e = err as {
    message?: string;
    error_description?: string;
    error?: string;
    details?: string;
    hint?: string;
    code?: string;
  };

  const msg = e.message || e.error_description || e.error || "Request failed";
  const details = e.details ? `\nDetails: ${e.details}` : "";
  const hint = e.hint ? `\nHint: ${e.hint}` : "";
  const code = e.code ? `\nCode: ${e.code}` : "";

  return `${msg}${details}${hint}${code}`;
}

const branches = [
  "Computer Science and Engineering",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Production & Industrial Engineering",
  "B.Arch",
  "B.Pharm",
  "Mathematics & Computing",
  "Others",
] as const;

export function OnboardingForm({
  className,
  redirect,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { redirect?: string | null }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    isBitMesra: false,
    college: "",
    rollNo: "",
    branch: "",
    phone: "",
    whatsappNo: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isBitMesra: checked,
      college: checked ? "Birla Institute of Technology, Mesra" : "",
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return (
        formData.firstName.trim() && formData.lastName.trim() && formData.gender
      );
    }
    if (currentStep === 2) {
      const hasCollege = formData.isBitMesra || formData.college.trim();
      return hasCollege && formData.rollNo.trim() && formData.branch.trim();
    }
    if (currentStep === 3) {
      return formData.phone.trim() && formData.whatsappNo.trim();
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setError(null);
    } else {
      setError("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Final validation - ensure all steps are complete
      const isStep1Valid =
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.gender;
      const isStep2Valid =
        (formData.isBitMesra || formData.college.trim()) &&
        formData.rollNo.trim() &&
        formData.branch.trim();
      const isStep3Valid = formData.phone.trim() && formData.whatsappNo.trim();

      if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
        setError("Please complete all required fields in all steps");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userRes?.user;
      if (!user) throw new Error("User not authenticated");

      const payload = {
        id: user.id,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        gender: formData.gender.trim(),
        college: formData.college.trim(),
        roll_no: formData.rollNo.trim(),
        branch: formData.branch.trim(),
        phone: formData.phone.trim(),
        whatsapp_no: formData.whatsappNo.trim(),
        onboarding_completed: true,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (profileError) {
        console.error("[Onboarding] profiles upsert error:", profileError);
        throw profileError;
      }

      // Redirect to the intended destination or default to /protected
      router.push(redirect || "/protected");
      router.refresh();
    } catch (err) {
      console.error("[Onboarding] submit failed:", err);
      setError(formatSupabaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

        <CardHeader className="relative text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Student Information
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Step {currentStep} of 3:{" "}
            {currentStep === 1
              ? "Personal Details"
              : currentStep === 2
                ? "Academic Information"
                : "Contact Information"}
          </CardDescription>

          {/* Progress Bar */}
          <div className="flex gap-2 pt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all duration-300",
                  step <= currentStep ? "bg-white" : "bg-white/20",
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg
                    className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <pre className="text-xs text-red-200 flex-1 whitespace-pre-wrap leading-relaxed">
                    {error}
                  </pre>
                </div>
              )}

              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-white font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-white font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white font-medium">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger className="h-12 w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="bitMesra"
                        checked={formData.isBitMesra}
                        onCheckedChange={handleCheckboxChange}
                        className="border-white/30"
                      />
                      <Label
                        htmlFor="bitMesra"
                        className="text-white font-medium cursor-pointer"
                      >
                        I am from Birla Institute of Technology, Mesra
                      </Label>
                    </div>

                    {!formData.isBitMesra && (
                      <div className="space-y-2 pt-2">
                        <Label
                          htmlFor="college"
                          className="text-white font-medium"
                        >
                          College Name
                        </Label>
                        <Input
                          id="college"
                          name="college"
                          type="text"
                          placeholder="Enter your college name"
                          value={formData.college}
                          onChange={handleInputChange}
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNo" className="text-white font-medium">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNo"
                      name="rollNo"
                      type="text"
                      placeholder="BTECH/10xxx/xx"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-white font-medium">
                      Branch
                    </Label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="h-12 w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                    >
                      <option value="" className="bg-gray-900 text-white">
                        Select your branch
                      </option>
                      {branches.map((branch) => (
                        <option
                          key={branch}
                          value={branch}
                          className="bg-gray-900 text-white"
                        >
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="whatsappNo"
                      className="text-white font-medium"
                    >
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsappNo"
                      name="whatsappNo"
                      type="tel"
                      placeholder="Enter your WhatsApp number"
                      value={formData.whatsappNo}
                      onChange={handleInputChange}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl transition-all duration-300"
                  >
                    Previous
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className={cn(
                      "h-12 bg-white hover:bg-white/95 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
                      currentStep === 1 ? "w-full" : "flex-1",
                    )}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="relative cursor-pointer flex-1 h-12 bg-white hover:bg-white/95 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl group overflow-hidden transition-all duration-300"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/40 to-transparent" />
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="relative z-10">Saving...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">Complete Onboarding</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
