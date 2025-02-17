import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Shield,
  Loader2,
  KeyRound,
  LayoutGrid,
  Moon,
  Sun,
  UserCog,
  Camera,
} from "lucide-react";
import { ImageUploadPreview } from "@/components/ui/image-upload";
import {
  useMyProfile,
  useUpdateProfile,
  useUpdateAvatar,
  useChangePassword,
} from "@/api/profile";
import { cn } from "@/lib/utils";

// Profile Form Schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.any().optional(),
});

// Security Form Schema
const securityFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Add profile hooks
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { mutate: updateProfileMutation, isLoading: isProfileUpdating } =
    useUpdateProfile();
  const { mutate: updateAvatarMutation, isLoading: isAvatarUpdating } =
    useUpdateAvatar();
  const { mutate: changePasswordMutation, isLoading: isChangingPassword } =
    useChangePassword();

  // Profile Form with default values from profile data
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      avatar: "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || "",
        address: profile.address || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile, profileForm]);

  // Security Form
  const securityForm = useForm({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update the profile picture section
  const ProfilePictureUpload = ({ field }) => {
    const [previewUrl, setPreviewUrl] = useState(
      field.value || "/default-avatar.png"
    );
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (field.value && typeof field.value === "string") {
        setPreviewUrl(field.value);
      }
    }, [field.value]);

    const handleFileChange = async (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        try {
          setIsLoading(true);
          await updateAvatarMutation(file, {
            onSuccess: (data) => {
              field.onChange(data.avatar);
              toast({
                title: "Success",
                description: "Profile picture updated successfully",
              });
            },
            onError: (error) => {
              toast({
                title: "Error",
                description:
                  error.message || "Failed to update profile picture",
                variant: "destructive",
              });
              setPreviewUrl(field.value || "/default-avatar.png");
            },
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Avatar Container */}
          <div
            className={cn(
              "relative w-32 h-32 rounded-full overflow-hidden",
              "border-2 border-violet-500/20 dark:border-violet-500/30",
              "transition-all duration-200",
              isAvatarUpdating && "ring-4 ring-violet-500/30"
            )}
          >
            {/* Avatar Image */}
            <img
              src={previewUrl}
              alt="Profile"
              className={cn(
                "w-full h-full object-cover",
                "transition-all duration-200",
                (isHovered || isAvatarUpdating) && "scale-105 brightness-75"
              )}
            />

            {/* Upload Overlay */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center",
                "bg-black/30 backdrop-blur-[1px]",
                "transition-opacity duration-200",
                isHovered || isAvatarUpdating ? "opacity-100" : "opacity-0"
              )}
            >
              {isAvatarUpdating ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                    <div className="absolute inset-0 w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
                  </div>
                  <span className="text-white text-xs font-medium animate-pulse">
                    Uploading...
                  </span>
                </div>
              ) : (
                <>
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-medium">
                    Change Photo
                  </span>
                </>
              )}
            </div>

            {/* File Input */}
            <ImageUploadPreview
              value={field.value}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAvatarUpdating}
            />
          </div>

          {/* Progress Ring (visible during upload) */}
          {isAvatarUpdating && (
            <div className="absolute -inset-1">
              <div className="w-full h-full rounded-full border-4 border-violet-500/20 animate-pulse" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
            {isAvatarUpdating ? (
              <span className="text-violet-500 dark:text-violet-400">
                Uploading image...
              </span>
            ) : (
              "Recommended: Square JPG, PNG"
            )}
          </p>
          <p className="text-xs text-muted-foreground/70 dark:text-[#8B949E]/70">
            Max 5MB
          </p>
        </div>
      </div>
    );
  };

  // Update the profile form submission
  const onProfileSubmit = async (data) => {
    try {
      setIsLoading(true);
      await updateProfileMutation(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Profile updated successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to update profile",
              variant: "destructive",
            });
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the security form submission
  const onSecuritySubmit = async (data) => {
    try {
      await changePasswordMutation(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Password updated successfully",
            });
            securityForm.reset();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.message || "Failed to change password",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Show loading state while profile is loading
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col w-full h-auto bg-card dark:bg-[#202F36] border dark:border-[#2A3F47] rounded-lg p-1">
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-2 px-4 py-2.5 h-10 hover:bg-violet-50 dark:hover:bg-violet-500/5 data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-500/10 text-muted-foreground dark:text-[#8B949E] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 transition-colors"
              >
                <UserCog className="h-4 w-4" />
                Profile
              </TabsTrigger>

              <TabsTrigger
                value="security"
                className="w-full justify-start gap-2 px-4 py-2.5 h-10 hover:bg-violet-50 dark:hover:bg-violet-500/5 data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-500/10 text-muted-foreground dark:text-[#8B949E] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Security
              </TabsTrigger>

              <TabsTrigger
                value="appearance"
                className="w-full justify-start gap-2 px-4 py-2.5 h-10 hover:bg-violet-50 dark:hover:bg-violet-500/5 data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-500/10 text-muted-foreground dark:text-[#8B949E] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 transition-colors"
              >
                <LayoutGrid className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="profile">
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="border-b dark:border-[#2A3F47]">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-violet-500/20 dark:border-violet-500/30">
                      <img
                        src={
                          profileForm.watch("avatar") || "/default-avatar.png"
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
                        Update your personal information and profile picture.
                      </CardDescription>
                      <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                        {/* Assuming you have user context */}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-8"
                    >
                      <div className="space-y-8">
                        <FormField
                          control={profileForm.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem>
                              <div className="p-6 bg-violet-50/50 dark:bg-violet-500/5 rounded-lg border border-violet-500/20 dark:border-violet-500/10">
                                <ProfilePictureUpload field={field} />
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-6">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                            <h3 className="text-lg font-medium text-foreground dark:text-white">
                              Personal Information
                            </h3>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                    Phone Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="+1 (555) 000-0000"
                                      {...field}
                                      className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                    Address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="123 Street, City, Country"
                                      {...field}
                                      className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={
                            isLoading ||
                            isProfileLoading ||
                            isProfileUpdating ||
                            isAvatarUpdating
                          }
                          className="bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 text-white min-w-[120px]"
                        >
                          {isLoading ||
                          isProfileLoading ||
                          isProfileUpdating ||
                          isAvatarUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="border-b dark:border-[#2A3F47]">
                  <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
                    Customize your dashboard experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Theme
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Select your preferred theme.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9 dark:border-[#2A3F47]"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="border-b dark:border-[#2A3F47]">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
                        Security Settings
                      </CardTitle>
                      <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
                        Manage your password and security preferences.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                      <h3 className="text-lg font-medium text-foreground dark:text-white">
                        Change Password
                      </h3>
                    </div>

                    <Form {...securityForm}>
                      <form
                        onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                        className="space-y-6"
                      >
                        <div className="grid gap-6 max-w-md">
                          <FormField
                            control={securityForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                  Current Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={securityForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                  New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                  />
                                </FormControl>
                                <FormDescription className="text-sm text-muted-foreground dark:text-[#8B949E]">
                                  At least 6 characters long
                                </FormDescription>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={securityForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground dark:text-[#E3E5E5]">
                                  Confirm New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    className="bg-background dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] focus:ring-violet-500/20 dark:focus:ring-violet-500/20"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isLoading || isChangingPassword}
                            className="bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 text-white min-w-[140px]"
                          >
                            {isLoading || isChangingPassword ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
