"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const userName = session.data?.user?.name || "Aser"; 
  const userImage = session.data?.user?.image || ""; 
  console.log(userName , userImage)

  return (
    <header className="py-4 px-6 md:px-10 bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Mind Scribe
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-4 gap-4 items-center">
            <li>
              <Link href="#features" className="text-gray-300 hover:text-white">
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-white"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-white"
              >
                Testimonials
              </Link>
            </li>
            {!session.data?.user && (
              <li>
                <Button
                  disabled={loading}
                  variant="outline"
                  className="text-white border-white bg-black hover:bg-white hover:text-gray-900"
                  onClick={() => {
                    signIn();
                    setLoading(true);
                  }}
                >
                  {loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient
                        id="a11"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stopColor="#FFFFFF"></stop>
                        <stop
                          offset=".3"
                          stopColor="#FFFFFF"
                          stopOpacity=".9"
                        ></stop>
                        <stop
                          offset=".6"
                          stopColor="#FFFFFF"
                          stopOpacity=".6"
                        ></stop>
                        <stop
                          offset=".8"
                          stopColor="#FFFFFF"
                          stopOpacity=".3"
                        ></stop>
                        <stop
                          offset="1"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        ></stop>
                      </radialGradient>
                      <circle
                        transform="center"
                        fill="none"
                        stroke="url(#a11)"
                        strokeWidth="13"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
                        cx="100"
                        cy="100"
                        r="70"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        transform="center"
                        fill="none"
                        opacity=".2"
                        stroke="#FFFFFF"
                        strokeWidth="13"
                        strokeLinecap="round"
                        cx="100"
                        cy="100"
                        r="70"
                      ></circle>
                    </svg>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </li>
            )}
            {!session.data?.user && (
              <li>
                <Button
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                  onClick={() => {
                    signIn();
                    setLoading(true);
                  }}
                >
                  {loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient
                        id="a11"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stopColor="#FFFFFF"></stop>
                        <stop
                          offset=".3"
                          stopColor="#FFFFFF"
                          stopOpacity=".9"
                        ></stop>
                        <stop
                          offset=".6"
                          stopColor="#FFFFFF"
                          stopOpacity=".6"
                        ></stop>
                        <stop
                          offset=".8"
                          stopColor="#FFFFFF"
                          stopOpacity=".3"
                        ></stop>
                        <stop
                          offset="1"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        ></stop>
                      </radialGradient>
                      <circle
                        transform="center"
                        fill="none"
                        stroke="url(#a11)"
                        strokeWidth="13"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
                        cx="100"
                        cy="100"
                        r="70"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        transform="center"
                        fill="none"
                        opacity=".2"
                        stroke="#FFFFFF"
                        strokeWidth="13"
                        strokeLinecap="round"
                        cx="100"
                        cy="100"
                        r="70"
                      ></circle>
                    </svg>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </li>
            )}
            {session.data?.user && (
              <li>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full"  src={userImage} />
                  <AvatarFallback className="text-white">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </li>
            )}
            {session.data?.user && (
              <li>
                <Button
                  disabled={loading}
                  variant="outline"
                  className="text-white border-white bg-black hover:bg-white hover:text-gray-900"
                  onClick={() => {
                    signIn();
                    setLoading(true);
                  }}
                >
                  {loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient
                        id="a11"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stopColor="#FFFFFF"></stop>
                        <stop
                          offset=".3"
                          stopColor="#FFFFFF"
                          stopOpacity=".9"
                        ></stop>
                        <stop
                          offset=".6"
                          stopColor="#FFFFFF"
                          stopOpacity=".6"
                        ></stop>
                        <stop
                          offset=".8"
                          stopColor="#FFFFFF"
                          stopOpacity=".3"
                        ></stop>
                        <stop
                          offset="1"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        ></stop>
                      </radialGradient>
                      <circle
                        transform="center"
                        fill="none"
                        stroke="url(#a11)"
                        strokeWidth="13"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
                        cx="100"
                        cy="100"
                        r="70"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        transform="center"
                        fill="none"
                        opacity=".2"
                        stroke="#FFFFFF"
                        strokeWidth="13"
                        strokeLinecap="round"
                        cx="100"
                        cy="100"
                        r="70"
                      ></circle>
                    </svg>
                  ) : (
                    "Log Out"
                  )}
                </Button>
              </li>
            )}
          </ul>
        </nav>
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="mt-4 md:hidden">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="#features"
                className="text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Button
                disabled={loading}
                variant="outline"
                className="w-full text-white bg-black border-white hover:bg-white hover:text-gray-900"
                onClick={() => {
                  signIn();
                  setIsMenuOpen(false);
                  setLoading(true);
                }}
              >
                {loading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <radialGradient
                      id="a11"
                      cx=".66"
                      fx=".66"
                      cy=".3125"
                      fy=".3125"
                      gradientTransform="scale(1.5)"
                    >
                      <stop offset="0" stopColor="#FFFFFF"></stop>
                      <stop
                        offset=".3"
                        stopColor="#FFFFFF"
                        stopOpacity=".9"
                      ></stop>
                      <stop
                        offset=".6"
                        stopColor="#FFFFFF"
                        stopOpacity=".6"
                      ></stop>
                      <stop
                        offset=".8"
                        stopColor="#FFFFFF"
                        stopOpacity=".3"
                      ></stop>
                      <stop
                        offset="1"
                        stopColor="#FFFFFF"
                        stopOpacity="0"
                      ></stop>
                    </radialGradient>
                    <circle
                      transform="center"
                      fill="none"
                      stroke="url(#a11)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray="200 1000"
                      strokeDashoffset="0"
                      cx="100"
                      cy="100"
                      r="70"
                    >
                      <animateTransform
                        type="rotate"
                        attributeName="transform"
                        calcMode="spline"
                        dur="2"
                        values="360;0"
                        keyTimes="0;1"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </circle>
                    <circle
                      transform="center"
                      fill="none"
                      opacity=".2"
                      stroke="#FFFFFF"
                      strokeWidth="13"
                      strokeLinecap="round"
                      cx="100"
                      cy="100"
                      r="70"
                    ></circle>
                  </svg>
                ) : (
                  "Log In"
                )}
              </Button>
            </li>
            <li>
              <Button
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                onClick={() => {
                  signIn();
                  setIsMenuOpen(false);
                  setLoading(true);
                }}
              >
                {loading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <radialGradient
                      id="a11"
                      cx=".66"
                      fx=".66"
                      cy=".3125"
                      fy=".3125"
                      gradientTransform="scale(1.5)"
                    >
                      <stop offset="0" stopColor="#FFFFFF"></stop>
                      <stop
                        offset=".3"
                        stopColor="#FFFFFF"
                        stopOpacity=".9"
                      ></stop>
                      <stop
                        offset=".6"
                        stopColor="#FFFFFF"
                        stopOpacity=".6"
                      ></stop>
                      <stop
                        offset=".8"
                        stopColor="#FFFFFF"
                        stopOpacity=".3"
                      ></stop>
                      <stop
                        offset="1"
                        stopColor="#FFFFFF"
                        stopOpacity="0"
                      ></stop>
                    </radialGradient>
                    <circle
                      transform="center"
                      fill="none"
                      stroke="url(#a11)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray="200 1000"
                      strokeDashoffset="0"
                      cx="100"
                      cy="100"
                      r="70"
                    >
                      <animateTransform
                        type="rotate"
                        attributeName="transform"
                        calcMode="spline"
                        dur="2"
                        values="360;0"
                        keyTimes="0;1"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </circle>
                    <circle
                      transform="center"
                      fill="none"
                      opacity=".2"
                      stroke="#FFFFFF"
                      strokeWidth="13"
                      strokeLinecap="round"
                      cx="100"
                      cy="100"
                      r="70"
                    ></circle>
                  </svg>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
