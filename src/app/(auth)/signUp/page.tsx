"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/Email";
import { useDebounceCallback } from "usehooks-ts";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && form.formState.dirtyFields.username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/checkNameUnique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username, form.formState.dirtyFields.username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signUp", data);
      toast.success(response.data.message);
      router.replace(`/signIn`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error signing up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-850">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join the Community
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sign up to explore movies, series, songs, and books tailored for
            you.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </FormControl>
                  <div className="flex items-center gap-2">
                    {isCheckingUsername && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    )}
                    <span
                      className={`text-sm ${
                        usernameMessage === "Username is Unique"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {usernameMessage}
                    </span>
                  </div>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
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
              disabled={isCheckingUsername || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Sign In Link */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signIn"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
