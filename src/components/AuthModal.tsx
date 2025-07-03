import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to sign in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        onOpenChange(false);
        setFormData({ email: "", password: "" });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-slate-900 border-slate-700 text-white max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-white text-center'>Sign In</DialogTitle>
          <DialogDescription className='sr-only'>
            Sign in to your Star Wars Collectors account to access your collection and wishlist.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='email' className='text-slate-300'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className='bg-slate-800 border-slate-600 text-white'
              placeholder='Enter your email'
              disabled={loading}
              required
            />
          </div>
          <div>
            <Label htmlFor='password' className='text-slate-300'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className='bg-slate-800 border-slate-600 text-white'
              placeholder='Enter your password'
              disabled={loading}
              required
            />
          </div>
          <Button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
            {loading ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
