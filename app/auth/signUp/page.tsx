"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { EyeIcon, EyeOffIcon, ArrowRight, Loader2, Brain } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { z } from "zod";
import axios from 'axios'
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const signUpschema = z.object({
    name: z.string().min(1, "Name is Required"),
    email: z.string().email("Enter a Valid Email").min(1, "Email is Required"),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .regex(/[A-Z]/, "Password must contain atleast one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .min(1, "Password is required"),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id , value} = e.target;
    setFormData((prev) => ({...prev , [id]: value}));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validation = signUpschema.safeParse(formData)

    if (!validation.success) {
      const errorMessages = Object.values(validation.error.format())
      .flat()
      .map((err: string | { _errors: string[] }) => {
        // Handle both string and object with _errors
        if (typeof err === "string") {
          return err; // If it's a string, return it directly
        } else if (err._errors && Array.isArray(err._errors)) {
          return err._errors.join(", "); // Join the array of errors into a single string
        }
        return ""; // Return an empty string if no valid error is found
      })
      .join(", ");
      setError(errorMessages);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/SignUp", formData);
      if (response.status === 200) {
        setError("");
        setTimeout(() => {
          router.push("/auth/signIn");
        }, 1500);
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      } else {
        setError("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="h-screen bg-neutral-950 flex relative overflow-hidden selection:bg-orange-500/30">
        {/* Back Button */}
        <Link
          href="/"
          className="fixed top-8 left-8 lg:left-auto lg:right-8 z-50 text-neutral-500 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
  
        {/* Split Layout */}
        <div className="flex-1 flex w-full">
          {/* Left: Image Section (Visible on LG) */}
          <motion.div   
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-neutral-950 border-r border-white/5"
          >
            <motion.div
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src="/images/heroimg.webp"
                alt="Mindful Journey"
                fill
                className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-1000"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-orange-500/10 z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-12">
              <div className="inline-block p-4 rounded-full bg-orange-500/10 backdrop-blur-xl mb-8 border border-orange-500/20">
                <Brain className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-5xl font-medium text-white mb-6 tracking-tighter">
                Track your <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">Soul</span>
              </h2>
              <p className="text-neutral-400 text-lg font-light leading-relaxed max-w-sm mx-auto">
                Join our community of mindful writers and discover patterns in your inner thoughts.
              </p>
            </div>
          </motion.div>
  
          {/* Right: Auth Card Section */}
          <div className="flex-1 flex items-center justify-center p-4 relative z-10">
            {/* Background Elements behind card */}
            <div className="absolute inset-0 pointer-events-none lg:bg-neutral-950/50">
              <div className="absolute top-[-5%] right-[20%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
              <BackgroundBeams className="opacity-20" />
            </div>
  
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[420px] relative z-20"
            >
              <div className="bg-neutral-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors duration-500" />
  
                <div className="relative z-10 uppercase tracking-tight">
                  <div className="mb-5">
                    <h1 className="text-2xl font-medium text-white mb-1">Create Account</h1>
                    <p className="text-neutral-500 text-xs">Start your journey to mental clarity today.</p>
                  </div>
  
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider ml-1">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white/[0.03] border-white/5 text-white placeholder:text-neutral-700 rounded-lg h-10 text-sm focus:ring-orange-500/30 focus:border-orange-500 transition-all hover:bg-white/[0.05]"
                      />
                    </div>
  
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider ml-1">Work Email</Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white/[0.03] border-white/5 text-white placeholder:text-neutral-700 rounded-lg h-10 text-sm focus:ring-orange-500/30 focus:border-orange-500 transition-all hover:bg-white/[0.05]"
                      />
                    </div>
  
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider ml-1">Password</Label>
                      <div className="relative group/input">
                        <Input
                          id="password"
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="bg-white/[0.03] border-white/5 text-white placeholder:text-neutral-700 rounded-lg h-10 text-sm focus:ring-orange-500/30 focus:border-orange-500 transition-all hover:bg-white/[0.05]"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                        >
                          {passwordVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
  
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-[11px] bg-red-400/5 p-2 rounded-md border border-red-400/10"
                      >
                        {error}
                      </motion.p>
                    )}
  
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2 group mt-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
  
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-neutral-700 text-[9px] font-bold uppercase tracking-[0.2em]">Join with</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
  
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="w-full h-10 bg-white/[0.03] hover:bg-white/[0.05] text-white text-sm font-medium rounded-lg transition-all border border-white/5 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    Google workspace
                  </button>
  
                  <div className="mt-6 text-center border-t border-white/5 pt-6">
                    <p className="text-neutral-500 text-xs text-balance">
                      Already have an account?{" "}
                      <Link
                        href="/auth/signIn"
                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors ml-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    </div>
  );
}

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}