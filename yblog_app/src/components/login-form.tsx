import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PocketBase, { ClientResponseError, type AuthRecord, type RecordAuthResponse } from 'pocketbase'
import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form'
import { AlertCircleIcon } from "lucide-react"
import { motion } from "framer-motion";
import { useEffect } from "react"

const pb = new PocketBase('http://127.0.0.1:8090');

interface IAuthData {
  record: IUserData,
  token: string
}

interface IUserData {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  verified: boolean;
}

interface ILoginForm {
  email: string,
  password: string
}

const defaultFormValues: ILoginForm = {
  email: "",
  password: "",
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [serverErrors, setServerErrors] = useState<ClientResponseError | null>(null)
  const [authData, setAuthData] = useState<IAuthData | null>(null);
  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: async ({ value }) => {
      try {
        const authDataResponse = await pb.collection('users').authWithPassword(value.email, value.password);
        setAuthData(authDataResponse as IAuthData)
        setServerErrors(null)
      } catch (error) {
        if (error instanceof ClientResponseError) {
          setServerErrors(error)
          console.log(error.toJSON())
        }
        setAuthData(null)
      }
    },
  })

  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (serverErrors) {
      setShake(true);
    }
  }, [serverErrors]);

  const shakeAnimation = shake
    ? {
      x: [0, -10, 10, -10, 10, 0],
      boxShadow: [
        "0 0 0 2px #ef4444",
        "0 0 0 2px #ef4444",
        "0 0 0 2px #ef4444",
        "0 0 0 2px #ef4444",
        "0 0 0 2px #ef4444",
        "0 0 0 0px #ef4444"
      ],
      transition: { duration: 0.4 }
    }
    : {};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div
        animate={shakeAnimation}
        onAnimationComplete={() => setShake(false)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <form.Field
                    name="email"
                    children={(field) => (
                      <>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                      </>
                    )}>
                  </form.Field>
                </div>
                <div className="grid gap-3">
                  <form.Field name="password"
                    children={(field) => (
                      <>
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} id="password" type="password" required />
                      </>
                    )}>
                  </form.Field>
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            {serverErrors
              ? renderServerError(serverErrors)
              : <code>{JSON.stringify(authData, null, 2)}</code>
            }
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

function renderServerError(error: ClientResponseError | null) {
  if (!error) return null;

  switch (error.name) {
    case "ClientResponseError 0":
      return (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Server Unreachable</AlertTitle>
          <AlertDescription>
            <p>Unable to connect to the server. Please check your network or try again later.</p>
          </AlertDescription>
        </Alert>
      );
    case "ClientResponseError 400":
      return (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Unable to login.</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
            <ul className="list-inside list-disc text-sm">
              <li>Check your email and password</li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    default:
      return (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
          </AlertDescription>
        </Alert>
      );
  }
}