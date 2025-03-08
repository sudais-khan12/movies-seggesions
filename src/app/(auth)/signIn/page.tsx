"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signInSchema } from "@/schemas/signInSchema";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Sign-in successful");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error signing in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* SignIn Form */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl dark:bg-gray-850">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sign in to continue exploring movies, series, songs, and books.
          </p>
        </div>

        {/* Google Sign-In Button */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Sign In with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>

        {/* Sign-In Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Username Field */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      {...field}
                      className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </Form>

        {/* Sign Up and Reset Password Links */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            New Here?{" "}
            <Link
              href="/signUp"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            <Link
              href="/resetPassword"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
