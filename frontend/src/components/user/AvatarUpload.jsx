// frontend/src/components/user/AvatarUpload.jsx
import React, { useRef, useState } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAvatar,
  removeAvatar,
  selectUploading,
} from "@/store/slices/userSlice";
import { updateUser } from "@/store/slices/authSlice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getFullName = (user) => {
  if (!user) return "";
  if (user.name) return user.name;
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    ""
  );
};

const getInitials = (user) => {
  if (!user) return "U";
  const first = user.firstName || user.name?.split(" ")[0] || "";
  const last = user.lastName || user.name?.split(" ")[1] || "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
};

// ─────────────────────────────────────────────────────────────────────────────

const AvatarUpload = ({ user, open, onOpenChange }) => {
  const dispatch = useDispatch();
  const isUploading = useSelector(selectUploading); // ✅ use Redux state
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  // ── Reset local state ───────────────────────────────────────────────────────
  const resetState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Close dialog ────────────────────────────────────────────────────────────
  const closeDialog = () => {
    onOpenChange(false); // ✅ FIX: was wrongly calling setIsOpen(false) before
    resetState();
  };

  // ── File select ─────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) return;
    setError(null);

    // ✅ FIX: dispatch Redux thunk instead of calling usersApi directly
    const result = await dispatch(uploadAvatar(selectedFile));

    if (uploadAvatar.fulfilled.match(result)) {
      // Sync updated user into authSlice as well (so navbar avatar updates)
      dispatch(updateUser(result.payload));
      closeDialog();
    } else {
      setError(result.payload || "Failed to upload avatar. Please try again.");
    }
  };

  // ── Remove ──────────────────────────────────────────────────────────────────
  const handleRemove = async () => {
    if (!user?.avatar) return;
    setError(null);

    const result = await dispatch(removeAvatar());

    if (removeAvatar.fulfilled.match(result)) {
      dispatch(updateUser(result.payload)); // sync authSlice
      closeDialog();
    } else {
      setError(result.payload || "Failed to remove avatar. Please try again.");
    }
  };

  // ── Dialog open/close ───────────────────────────────────────────────────────
  const handleOpenChange = (newOpen) => {
    if (!newOpen) resetState();
    onOpenChange(newOpen);
  };

  const fullName = getFullName(user);
  const initials = getInitials(user);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or remove the current one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          {/* Preview */}
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={previewUrl || user?.avatar}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            {previewUrl && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive text-center w-full bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Controls */}
          <div className="flex flex-col w-full space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose New Image
            </Button>

            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>

              {user?.avatar && !previewUrl && (
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  disabled={isUploading}
                  size="icon"
                  title="Remove avatar"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* File info */}
          {selectedFile && (
            <div className="text-sm text-muted-foreground text-center">
              <p>{selectedFile.name}</p>
              <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarUpload;
