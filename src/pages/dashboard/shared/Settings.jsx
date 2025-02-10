import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Palette,
  Shield,
  Loader2,
  AlertCircle,
  BellRing,
  Globe,
  KeyRound,
  Languages,
  LayoutGrid,
  Moon,
  Sun,
  UserCog,
} from "lucide-react";
import { ImageUploadPreview } from "@/components/ui/image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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

// Add notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
});

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    },
  });

  // Security Form
  const securityForm = useForm({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Add these state hooks at the top of the component
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    compactMode: false,
    animations: true,
  });

  // Add these handler functions
  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAppearanceChange = (key) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Profile Update
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      // API call to update profile
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Change
  const onSecuritySubmit = async (data) => {
    setIsLoading(true);
    try {
      // API call to change password
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      securityForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      <Alert className="border-yellow-500/50 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
        <AlertDescription className="text-yellow-600 dark:text-yellow-500">
          This is a demo version. Changes won't be persisted.
        </AlertDescription>
      </Alert>

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
                value="notifications"
                className="w-full justify-start gap-2 px-4 py-2.5 h-10 hover:bg-violet-50 dark:hover:bg-violet-500/5 data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-500/10 text-muted-foreground dark:text-[#8B949E] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 transition-colors"
              >
                <BellRing className="h-4 w-4" />
                Notifications
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
                      <div className="flex flex-col items-center space-y-4 p-6 bg-violet-50/50 dark:bg-violet-500/5 rounded-lg border border-violet-500/20 dark:border-violet-500/10">
                        <FormField
                          control={profileForm.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem className="space-y-4 text-center">
                              <FormLabel className="text-foreground dark:text-[#E3E5E5] text-lg font-medium">
                                Profile Picture
                              </FormLabel>
                              <FormControl>
                                <ImageUploadPreview
                                  value={field.value}
                                  onChange={field.onChange}
                                  className="h-32 w-32 mx-auto"
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-muted-foreground dark:text-[#8B949E]">
                                Upload a profile picture. JPG, PNG or WebP, max
                                5MB.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>

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

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 text-white min-w-[120px]"
                        >
                          {isLoading ? (
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

            <TabsContent value="notifications">
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="border-b dark:border-[#2A3F47]">
                  <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
                    Manage how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Receive notifications about your account activity.
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() =>
                          handleNotificationChange("emailNotifications")
                        }
                        className="data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500"
                      />
                    </div>
                    <Separator className="dark:border-[#2A3F47]" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Security Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Get notified about security-related events.
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={() =>
                          handleNotificationChange("securityAlerts")
                        }
                        className="data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500"
                      />
                    </div>
                    <Separator className="dark:border-[#2A3F47]" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Receive updates about new features and promotions.
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={() =>
                          handleNotificationChange("marketingEmails")
                        }
                        className="data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500"
                      />
                    </div>
                  </div>
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
                    <Separator className="dark:border-[#2A3F47]" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Compact Mode
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Make the interface more compact.
                        </p>
                      </div>
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={() =>
                          handleAppearanceChange("compactMode")
                        }
                        className="data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500"
                      />
                    </div>
                    <Separator className="dark:border-[#2A3F47]" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground dark:text-[#E3E5E5]">
                          Animations
                        </Label>
                        <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                          Enable interface animations.
                        </p>
                      </div>
                      <Switch
                        checked={appearanceSettings.animations}
                        onCheckedChange={() =>
                          handleAppearanceChange("animations")
                        }
                        className="data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500"
                      />
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
                            disabled={isLoading}
                            className="bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 text-white min-w-[140px]"
                          >
                            {isLoading ? (
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
