"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Card, TextInput, Button, Title, Stack, Loader } from "@mantine/core";
import { IconUser, IconKey, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import adminApi from "../api/api";
import { notifications } from "@mantine/notifications";
import checkAdmin from "../_utils/check-admin";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Uncomment if you want to redirect authenticated users
  // useEffect(() => {
  //   if (checkAdmin()) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login = useMutation({
    mutationFn: adminApi.Login,
    onSuccess: (data) => {
      notifications.show({
        title: "Login Successful",
        message: "Welcome back!",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
      console.log(data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.user.role);
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
    // login.mutate({
    //   username: data.username,
    //   password: data.password,
    // });
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-100">
      <Card
        padding="lg"
        radius="xl"
        shadow="lg"
        withBorder
        style={{ width: "384px", backgroundColor: "#2b2c31" }}
      >
        <Stack gap="lg" className="p-10">
          <Title order={2} ta="center" c="white" fw={700}>
            RevoBike
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                placeholder="Enter your username"
                required
                {...register("username")}
                error={errors.username?.message}
                leftSection={<IconUser size={20} color="#98a2b3" />}
                radius="lg"
                styles={{
                  input: {
                    backgroundColor: "#343a40",
                    color: "white",
                    borderColor: "#495057",
                    "&:focus": {
                      borderColor: "#339af0",
                      boxShadow: "0 0 0 2px rgba(51, 154, 240, 0.2)",
                    },
                  },
                }}
              />

              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                {...register("password")}
                error={errors.password?.message}
                leftSection={<IconKey size={20} color="#98a2b3" />}
                rightSection={
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ padding: 0, width: "24px", height: "24px" }}
                  >
                    {showPassword ? (
                      <IconEyeOff size={16} color="#98a2b3" />
                    ) : (
                      <IconEye size={16} color="#98a2b3" />
                    )}
                  </Button>
                }
                radius="lg"
                styles={{
                  input: {
                    backgroundColor: "#343a40",
                    color: "white",
                    borderColor: "#495057",
                    "&:focus": {
                      borderColor: "#339af0",
                      boxShadow: "0 0 0 2px rgba(51, 154, 240, 0.2)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                color="blue.6"
                radius="lg"
                disabled={login.isPending}
                styles={{
                  root: {
                    backgroundColor: "#1c7ed6",
                    "&:hover": { backgroundColor: "#1864ab" },
                    transition: "background-color 0.3s",
                  },
                }}
              >
                {login.isPending ? <Loader size="sm" color="white" /> : "Login"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
}
