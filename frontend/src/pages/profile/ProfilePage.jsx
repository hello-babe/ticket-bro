// frontend/src/pages/profile/ProfilePage.jsx

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Key,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  Ticket,
  CreditCard,
  Camera,
  Trash2,
  Settings,
} from "lucide-react";
import {
  fetchProfile,
  uploadAvatar,
  removeAvatar,
  selectProfile,
  selectUserLoading,
  selectUploading,
} from "@/store/slices/userSlice";
import { logoutUser } from "@/store/slices/authSlice";
import { ROUTES } from "@/app/AppRoutes";

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ user, isUploading, onUpload, onRemove }) => {
  const ref = useRef();
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="relative group">
      {/* Image or initials */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-border ring-offset-2 ring-offset-background">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-black font-heading"
            style={{ background: "linear-gradient(135deg, #a3e635, #65a30d)" }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
        <button
          onClick={() => ref.current?.click()}
          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          title="Upload photo"
        >
          {isUploading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera size={14} className="text-white" />
          )}
        </button>
        {user.avatar && (
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-red-500/60 flex items-center justify-center transition-colors"
            title="Remove photo"
          >
            <Trash2 size={13} className="text-white" />
          </button>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
};

// ── Role badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    organizer:
      "bg-primary/15 text-lime-700 dark:text-lime-400 border-primary/30",
    user: "bg-secondary text-secondary-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border font-heading ${styles[role] ?? styles.user}`}
    >
      {role}
    </span>
  );
};

// ── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground mb-0.5 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-card border border-border rounded-2xl p-5 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-bold text-foreground font-heading">{title}</h2>
    {action}
  </div>
);

// ── Nav item ──────────────────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, desc, color, onClick, danger }) => {
  const inner = (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors cursor-pointer
      ${danger ? "hover:bg-destructive/5" : "hover:bg-muted"}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
        ${danger ? "bg-destructive/10" : "bg-muted"}`}
      >
        <Icon
          size={16}
          className={
            danger ? "text-destructive" : color || "text-muted-foreground"
          }
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold font-heading truncate ${danger ? "text-destructive" : "text-foreground"}`}
        >
          {label}
        </p>
        {desc && (
          <p className="text-xs text-muted-foreground truncate">{desc}</p>
        )}
      </div>
      <ChevronRight size={14} className="text-muted-foreground shrink-0" />
    </div>
  );

  if (onClick) return <div onClick={onClick}>{inner}</div>;
  return (
    <Link to={to} className="block no-underline">
      {inner}
    </Link>
  );
};

// ── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start gap-5">
        <div className="w-24 h-24 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded-lg w-40" />
          <div className="h-3.5 bg-muted rounded-lg w-64" />
          <div className="h-8 bg-muted rounded-lg w-28" />
        </div>
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-card border border-border rounded-2xl p-5">
        <div className="h-4 bg-muted rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((j) => (
            <div key={j} className="h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectUserLoading);
  const uploading = useSelector(selectUploading);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (isLoading && !profile) return <Skeleton />;
  if (!profile) return null;

  const address = [
    profile.address?.city,
    profile.address?.state,
    profile.address?.country,
  ]
    .filter(Boolean)
    .join(", ");
  const dob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 font-sans">
      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <Card>
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar
            user={profile}
            isUploading={uploading}
            onUpload={(file) => dispatch(uploadAvatar(file))}
            onRemove={() => dispatch(removeAvatar())}
          />

          <div className="flex-1 min-w-0">
            {/* Name + badges */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground font-heading leading-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <RoleBadge role={profile.role} />
              {profile.isEmailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>

            {/* Email */}
            <p className="text-sm text-muted-foreground mb-1.5 truncate">
              {profile.email}
            </p>

            {/* Bio */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {profile.bio || "No bio added yet. Tell people about yourself."}
            </p>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Link
                to={ROUTES.PROFILE.EDIT}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-black text-xs font-bold font-heading no-underline hover:brightness-110 active:brightness-95 transition-all"
              >
                <Edit3 size={12} /> Edit profile
              </Link>
              <Link
                to={ROUTES.PROFILE.CHANGE_PASSWORD}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold no-underline hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Key size={12} /> Password
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Personal info ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Personal information"
          action={
            <Link
              to={ROUTES.PROFILE.EDIT}
              className="text-xs font-semibold text-primary no-underline hover:brightness-90"
            >
              Edit
            </Link>
          }
        />
        <InfoRow icon={Mail} label="Email address" value={profile.email} />
        <InfoRow icon={Phone} label="Phone number" value={profile.phone} />
        <InfoRow icon={Calendar} label="Date of birth" value={dob} />
        <InfoRow
          icon={User}
          label="Age"
          value={profile.age ? `${profile.age} years old` : null}
        />
        <InfoRow icon={MapPin} label="Location" value={address} />
      </Card>

      {/* ── Account ───────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader title="Account" />
        <NavItem
          to={ROUTES.PROFILE.EDIT}
          icon={User}
          label="Edit profile"
          desc="Update your name, bio, and more"
        />
        <NavItem
          to={ROUTES.PROFILE.CHANGE_PASSWORD}
          icon={Key}
          label="Change password"
          desc="Update your account password"
        />
        <NavItem
          to={ROUTES.PROFILE.NOTIFICATIONS}
          icon={Bell}
          label="Notifications"
          desc="Manage your notification preferences"
        />
        <NavItem
          to={ROUTES.BOOKINGS.ROOT}
          icon={Ticket}
          label="My bookings"
          desc="View your event bookings"
        />
        <NavItem
          to={ROUTES.PAYMENTS.HISTORY}
          icon={CreditCard}
          label="Payment history"
          desc="View past transactions"
        />
      </Card>

      {/* ── Security ──────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader title="Security" />
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center
              ${profile.isTwoFactorEnabled ? "bg-emerald-500/10" : "bg-muted"}`}
            >
              <Shield
                size={16}
                className={
                  profile.isTwoFactorEnabled
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                }
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground font-heading">
                Two-factor authentication
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.isTwoFactorEnabled
                  ? "Your account is protected"
                  : "Add extra security to your account"}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
            ${
              profile.isTwoFactorEnabled
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {profile.isTwoFactorEnabled ? "On" : "Off"}
          </span>
        </div>

        {profile.lastLoginAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <Clock size={12} />
            <span>
              Last sign in:{" "}
              {new Date(profile.lastLoginAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        )}
      </Card>

      {/* ── Sign out ──────────────────────────────────────────────────────── */}
      <Card>
        <NavItem
          icon={LogOut}
          label="Sign out"
          desc="Sign out of your account"
          danger
          onClick={() =>
            dispatch(logoutUser()).then(() => navigate(ROUTES.AUTH.LOGIN))
          }
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
