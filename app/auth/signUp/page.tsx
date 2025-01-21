"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
  const [success, setSuccess] = useState("");
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id , value} = e.target;
    setFormData((prev) => ({...prev , [id]: value}));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = signUpschema.safeParse(formData)

    if (!validation.success) {
      const errorMessages = Object.values(validation.error.format())
      .flat()
      .map((err: string | { _errors: string[] }) => {
        // Handle both string and object with _errors
        if (typeof err === "string") {
          return err;  // If it's a string, return it directly
        } else if (err._errors && Array.isArray(err._errors)) {
          return err._errors.join(", ");  // Join the array of errors into a single string
        }
        return ""; // Return an empty string if no valid error is found
      })
      .join(", "); 
      setError(errorMessages)
      setSuccess('')
      return
    }

    try {
      const response = await axios.post('/api/auth/SignUp' , formData)
      if (response.status === 200) {
        setError("");
        setSuccess(response.data.message || "Account Created Successfully , Please Sign In.");
        setTimeout(() => {
            router.push("/auth/signin");    
        }, 1500 )
      } else {
        setError(response.data.message || "Something went wrong");
        setSuccess("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred.");
      }
  
      setSuccess("");
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const [loading , setLoading] = useState(false)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
      {/* Left Section */}
      <div className="relative hidden sm:block">
        <Image
          src="/images/heroimg.webp"
          alt="Meditation"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center px-4 sm:px-0">
        <BackgroundBeams className="absolute inset-0 -z-10 bg-neutral-900" />
        <Card className="w-full sm:w-3/4 lg:w-1/2 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Create a New Account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5 relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisible ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  {error && <p className="text-red-500">{JSON.stringify(error, null, 2)}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                  <Button className="mt-4 bg-black text-white hover:text-black">
                    Sign Up
                    </Button>
                  <div className="flex justify-center my-2">
                    <p className="text-sm">Or</p>
                  </div>
                  <Button variant="outline" onClick={() => signIn("google")}>
                    Sign Up With
                    <GoogleIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Label>
              Already have an account?{" "}
              <Link
                href={"/auth/signin"}
                className="text-blue-500 hover:cursor-pointer hover:underline"
              >
                Sign In
              </Link>
            </Label>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
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