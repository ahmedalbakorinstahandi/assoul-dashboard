"use client";

import { setCookie } from "cookies-next";
import toast from "react-hot-toast";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = { email, password, role: "admin" }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_AUTH}login`,
        formData
      );
      if (response.data?.success) {
        const token = response.data.user_token;
        const email = response.data.data.email;
        const name = response.data.data.first_name;

        setCookie("token", token);
        setCookie("email", email);
        setCookie("name", name);

        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.message || "Login failed!");
        setError(response.message);

      }

      // if (email === "admin@assoul.com" && password === "password") {
      //   router.push("/");
      // } else {
      //   setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      // }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Login failed!");

      // setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "auto", height: "100vh" }}
      className="min-h-screen flex items-center justify-center  dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#ffac33] rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="عسول"
                width={40}
                height={40}
                className="text-white"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بيانات تسجيل الدخول للوصول إلى لوحة تحكم عسول
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{
                    left: " 10px"
                  }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked)
                  }
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  تذكرني
                </Label>
              </div>
              <a href="#" className="text-sm text-[#ffac33] hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div> */}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#ffac33] hover:bg-[#f59f00]"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div >
  );
}
