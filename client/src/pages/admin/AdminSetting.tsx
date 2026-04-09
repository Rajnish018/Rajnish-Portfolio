import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    User,
    Lock,
    Settings,
    Save,
    UploadCloud,
    X, Eye, EyeOff, LockIcon
} from "lucide-react";
import { useToast } from "@/src/contexts/ToastContext";

import {
    getProfileApi,
    updateProfileApi,
    changePasswordApi,
} from "../../services/apiService";

type TabType = "profile" | "security" | "preferences";

export const AdminSettings: React.FC = () => {
    const{showToast}=useToast();
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: "",
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [preferences, setPreferences] = useState({
        darkMode: true,
        emailNotifications: true,
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // ---------------- FETCH PROFILE ----------------
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfileApi();
                setProfile(data);
            } catch (err) {
                console.error("Profile fetch error", err);
            }
        };

        fetchProfile();
    }, []);


    // ---------------- IMAGE UPLOAD ----------------
 const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    showToast("Only image files allowed", "error");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast("Avatar must be < 2MB", "error");
    return;
  }

  // cleanup old preview
  if (profile.avatar?.startsWith("blob:")) {
    URL.revokeObjectURL(profile.avatar);
  }

  setSelectedFile(file);

  // preview
  const previewUrl = URL.createObjectURL(file);

  setProfile((prev) => ({
    ...prev,
    avatar: previewUrl,
  }));
};
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) processFile(file);
};

useEffect(() => {
  const preview = profile.avatar;

  return () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  };
}, [profile.avatar]);

const handleProfileUpdate = async () => {
  if (!profile.name.trim() || !profile.email.trim()) {
    showToast("Name and email are required", "error");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("name", profile.name.trim());
    formData.append("email", profile.email.trim());

    // ✅ IMAGE LOGIC
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    } else if (
      profile.avatar &&
      !profile.avatar.startsWith("blob:")
    ) {
      formData.append("existingAvatar", profile.avatar);
    }

    const updatedUser = await updateProfileApi(formData);

    // ✅ Sync UI with backend response
    setProfile(updatedUser);

    showToast("Profile updated successfully", "success");

    // ✅ Reset states
    setIsEditing(false);
    setSelectedFile(null);

  } catch (err: any) {
    showToast(
      err?.response?.data?.message || "Update failed",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

    // ---------------- PASSWORD ----------------
    const handlePasswordUpdate = async () => {
        if (password.newPassword !== password.confirmPassword) {
            return setMessage("Passwords do not match ❌");
        }

        setLoading(true);

        try {
            await changePasswordApi({
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            });

            setMessage("Password updated 🔐");

            setPassword({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch {
            setMessage("Failed ❌");
        }

        setLoading(false);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: <User size={16} /> },
        { id: "security", label: "Security", icon: <Lock size={16} /> },
        { id: "preferences", label: "Preferences", icon: <Settings size={16} /> },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-white/40 text-sm">
                    Manage your account and preferences
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white/5 p-2 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`relative px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${activeTab === tab.id
                            ? "text-white"
                            : "text-white/40 hover:text-white"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}

                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 space-y-8"
            >
                {/* ---------------- PROFILE ---------------- */}
                {activeTab === "profile" && (
                    <div className="space-y-8 max-w-full">

                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">Profile</h2>
                                <p className="text-sm text-white/40">
                                    Manage your personal information
                                </p>
                            </div>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-accent hover:underline"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-sm text-red-400 hover:underline"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Card */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">

                            {/* ---------------- VIEW MODE ---------------- */}
                            {!isEditing ? (
                                <div className="flex items-center gap-5">

                                    {/* Avatar */}
                                    <div className="relative">
                                        {profile.avatar ? (
                                            <img
                                                src={profile.avatar}
                                                className="w-20 h-20 rounded-xl object-cover ring-2 ring-white/10"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-linear-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-semibold text-xl">
                                                {profile.name?.charAt(0).toUpperCase() || "A"}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {profile.name || "Unnamed User"}
                                        </p>
                                        <p className="text-sm text-white/40">
                                            {profile.email || "No email"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">

                                    {/* ---------------- AVATAR ---------------- */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="relative border border-dashed border-white/20 rounded-xl p-6 text-center hover:border-accent transition cursor-pointer group"
                                    >
                                        {uploading ? (
                                            <p className="text-sm text-white/40 animate-pulse">
                                                Uploading...
                                            </p>
                                        ) : (
                                            <>
                                                {profile.avatar ? (
                                                    <div className="relative w-fit mx-auto">
                                                        <img
                                                            src={profile.avatar}
                                                            className="w-24 h-24 rounded-xl object-cover"
                                                        />

                                                        {/* Remove */}
                                                        <button
                                                            onClick={() =>
                                                                setProfile((prev) => ({ ...prev, avatar: "" }))
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-white/40">
                                                        <UploadCloud size={28} />
                                                        <p className="text-sm">
                                                            Drag & drop or click to upload avatar
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Hidden input */}
                                                <input
                                                    type="file"
                                                    id="avatarUpload"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />

                                                <label
                                                    htmlFor="avatarUpload"
                                                    className="absolute inset-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* ---------------- INPUTS ---------------- */}
                                    <div className="space-y-4">

                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-white/40">
                                                Full Name
                                            </label>
                                            <input
                                                value={profile.name}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, name: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 mt-1 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition placeholder:text-white/30"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-white/40">
                                                Email Address
                                            </label>
                                            <input
                                                value={profile.email}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, email: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 mt-1 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition placeholder:text-white/30"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                    </div>

                                    {/* ---------------- ACTIONS ---------------- */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleProfileUpdate}
                                            disabled={loading}
                                           className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
                                           >
                                            <Save size={16} />
                                            {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* ---------------- SECURITY ---------------- */}
                {activeTab === "security" && (
                    <div className="space-y-8 max-w-full">

                        {/* Header */}
                        <div>
                            <h2 className="text-xl font-semibold">Security</h2>
                            <p className="text-sm text-white/40">
                                Manage your password and keep your account secure
                            </p>
                        </div>

                        {/* Card */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">

                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">
                                    Current Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        value={password.currentPassword}
                                        onChange={(e) =>
                                            setPassword({ ...password, currentPassword: e.target.value })
                                        }
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition pr-10 placeholder:text-white/30"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                current: !prev.current,
                                            }))
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                    >
                                        {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">
                                    New Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        value={password.newPassword}
                                        onChange={(e) =>
                                            setPassword({ ...password, newPassword: e.target.value })
                                        }
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition pr-10 placeholder:text-white/30"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                new: !prev.new,
                                            }))
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                    >
                                        {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Strength Indicator */}
                                {password.newPassword && (
                                    <div className="flex gap-1 mt-1">
                                        <div
                                            className={`h-1 flex-1 rounded ${password.newPassword.length > 8
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        />
                                        <div
                                            className={`h-1 flex-1 rounded ${password.newPassword.length > 10
                                                ? "bg-green-500"
                                                : "bg-white/10"
                                                }`}
                                        />
                                        <div
                                            className={`h-1 flex-1 rounded ${password.newPassword.length > 12
                                                ? "bg-green-500"
                                                : "bg-white/10"
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        value={password.confirmPassword}
                                        onChange={(e) =>
                                            setPassword({ ...password, confirmPassword: e.target.value })
                                        }
                                        placeholder="Re-enter new password"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition pr-10 placeholder:text-white/30"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                confirm: !prev.confirm,
                                            }))
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                    >
                                        {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Match Indicator */}
                                {password.confirmPassword && (
                                    <p
                                        className={`text-xs ${password.newPassword === password.confirmPassword
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {password.newPassword === password.confirmPassword
                                            ? "Passwords match ✓"
                                            : "Passwords do not match ❌"}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handlePasswordUpdate}
                                    disabled={
                                        loading ||
                                        !password.currentPassword ||
                                        !password.newPassword ||
                                        password.newPassword !== password.confirmPassword
                                    }
                                    className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(124,58,237,0.3)]"

                                >
                                    <LockIcon size={16} />
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* ---------------- PREFERENCES ---------------- */}
                {activeTab === "preferences" && (
                    <div className="space-y-6 max-w-full">

                        {/* Header */}
                        <div>
                            <h2 className="text-xl font-semibold">Preferences</h2>
                            <p className="text-sm text-white/40">
                                Customize your experience and system behavior
                            </p>
                        </div>

                        {/* Settings List */}
                        <div className="space-y-4">

                            {/* Dark Mode */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <p className="text-sm font-medium text-white">Dark Mode</p>
                                    <p className="text-xs text-white/40">
                                        Enable dark theme across dashboard
                                    </p>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() =>
                                        setPreferences((prev) => ({
                                            ...prev,
                                            darkMode: !prev.darkMode,
                                        }))
                                    }
                                    className={`relative w-12 h-6 rounded-full transition ${preferences.darkMode ? "bg-accent" : "bg-white/20"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${preferences.darkMode ? "translate-x-6" : ""
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Email Notifications
                                    </p>
                                    <p className="text-xs text-white/40">
                                        Receive updates and alerts via email
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setPreferences((prev) => ({
                                            ...prev,
                                            emailNotifications: !prev.emailNotifications,
                                        }))
                                    }
                                    className={`relative w-12 h-6 rounded-full transition ${preferences.emailNotifications
                                        ? "bg-accent-secondary"
                                        : "bg-white/20"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${preferences.emailNotifications ? "translate-x-6" : ""
                                            }`}
                                    />
                                </button>
                            </div>

                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => {
                                    // future API call
                                    setMessage("Preferences saved ✅");
                                }}
                                className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(124,58,237,0.3)]"

                            >
                                Save Preferences
                            </button>
                        </div>

                    </div>
                )}

            </motion.div>

            {message && <div className="text-accent">{message}</div>}
        </div>
    );
};
