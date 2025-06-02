"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  TextInput,
  Button,
  Title,
  Stack,
  Loader,
  PasswordInput,
} from "@mantine/core";
import { IconKey, IconMail } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Login } from "../api/user";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required!")
    .email("Invalid email address!"),
  password: z
    .string()
    .nonempty("Password is required!")
    .min(8, "Password must be at least 8 characters!"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  const login = useMutation({
    mutationFn: Login,
    onSuccess: (data) => {
      notifications.show({
        title: "Login Successful",
        message: "Welcome back!",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", data.user.role);
      reset();
      router.push("/dashboard");
    },
    onError: (error) => {
      notifications.show({
        title: "Failure",
        message: error ? error.message : "An error occurred",
        color: "red",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#154b1b] p-4 sm:p-6 md:p-8">
      <Card
        padding="xl"
        radius="xl"
        shadow="2xl"
        withBorder
        className="bg-white w-full max-w-sm sm:max-w-md transition-transform duration-300"
      >
        <Stack gap="lg" className="p-6 sm:p-8">
          <Title
            order={2}
            ta="center"
            c="gray.8"
            fw={700}
            className="text-2xl sm:text-3xl tracking-tight"
          >
            Admin Login
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="lg">
              <TextInput
                label="Email"
                placeholder="john@gmail.com"
                required
                {...register("email")}
                error={errors.email?.message}
                leftSection={<IconMail size={20} color="#154b1b" />}
                radius="md"
                styles={{
                  input: {
                    borderColor: "#154b1b",
                  },
                  label: {
                    color: "#1f2937",
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: "8px",
                  },
                  error: {
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  },
                }}
                className="w-full"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...register("password")}
                error={errors.password?.message}
                leftSection={<IconKey size={20} color="#154b1b" />}
                radius="md"
                styles={{
                  input: {
                    borderColor: "#154b1b",
                  },
                  label: {
                    color: "#1f2937",
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: "8px",
                  },
                  error: {
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  },
                }}
                className="w-full"
              />

              <Button
                type="submit"
                fullWidth
                radius="md"
                className="bg-[#154b1b] hover:bg-green-600 text-white font-semibold  text-base transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {login.isPending ? (
                  <Loader size="sm" color="white" />
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
}
