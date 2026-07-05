import { useEffect, useRef, useState } from "react";
import { Lock, Save } from "lucide-react";
import { useNavigate } from "../../lib/router";
import AdminLayout from "../../components/layout/AdminLayout";
import { appendAssetVersion, buildApiUrl, resolveAssetUrl } from "../../lib/api";
import { getAdminAuthHeaders, logoutAdmin, updateStoredAdminProfile } from "../../utils/adminAuth";
import { friendlyRequestError, prepareImageForUpload, readJsonResponse } from "../../utils/imageUpload";

const fallbackAdminAvatar = "/images/rocket/form2.png";

const initialProfileForm = {
  name: "",
  email: "",
  phone: "",
  avatar: ""
};

const initialPasswordForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
};

function getVersionedAvatar(profile) {
  return appendAssetVersion(resolveAssetUrl(profile?.avatar) || fallbackAdminAvatar, profile?.updatedAt || "");
}

function getFreshAvatar(profile) {
  return appendAssetVersion(resolveAssetUrl(profile?.avatar) || fallbackAdminAvatar, Date.now());
}

function profilesHaveDifferentAvatars(previousProfile, nextProfile) {
  return String(previousProfile?.avatar || "") !== String(nextProfile?.avatar || "");
}

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef(null);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(fallbackAdminAvatar);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/profile"), {
          headers: getAdminAuthHeaders()
        });
        const data = await response.json();

        if (response.status === 401) {
          logoutAdmin();
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setProfileForm(data.profile);
        setProfileImagePreview(getVersionedAvatar(data.profile) || fallbackAdminAvatar);
        updateStoredAdminProfile(data.profile);
      } catch (loadError) {
        setProfileError(loadError.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  const handleProfileChange = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
    setProfileMessage("");
    setProfileError("");
  };

  const handleProfileImageChange = async (event) => {
    const nextFile = event.target.files?.[0] || null;
    setProfileMessage("");
    setProfileError("");

    if (!nextFile) {
      setProfileImageFile(null);
      setProfileImagePreview(getVersionedAvatar(profileForm) || fallbackAdminAvatar);
      return;
    }

    try {
      const optimizedFile = await prepareImageForUpload(nextFile, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.82,
        forceOptimize: true
      });

      setProfileImageFile(optimizedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(typeof reader.result === "string" ? reader.result : fallbackAdminAvatar);
      };
      reader.readAsDataURL(optimizedFile);
    } catch (imageError) {
      setProfileImageFile(null);
      setProfileImagePreview(getVersionedAvatar(profileForm) || fallbackAdminAvatar);
      setProfileError(friendlyRequestError(imageError, "Unable to prepare this image for upload."));

      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = "";
      }
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
    setPasswordMessage("");
    setPasswordError("");
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      setProfileMessage("");
      setProfileError("");
      const hadSelectedImage = Boolean(profileImageFile);
      const previousProfile = profileForm;

      const formData = new FormData();
      formData.append("name", profileForm.name || "");
      formData.append("email", profileForm.email || "");
      formData.append("phone", profileForm.phone || "");

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const response = await fetch(buildApiUrl("/api/admin/profile"), {
        method: "PUT",
        headers: {
          ...getAdminAuthHeaders()
        },
        body: formData
      });

      const data = await readJsonResponse(response, "Failed to save profile.");

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      if (hadSelectedImage && !data.avatarUpdated) {
        throw new Error("Profile details were saved, but the new image was not uploaded. Please try again.");
      }

      const savedProfile = {
        ...data.profile,
        avatar: data.uploadedAvatar || data.profile?.avatar || profileForm.avatar,
        updatedAt: data.profile?.updatedAt || new Date().toISOString()
      };

      if (hadSelectedImage && !profilesHaveDifferentAvatars(previousProfile, savedProfile)) {
        throw new Error("The profile image was not changed on the server. Please choose the image again and save.");
      }

      setProfileForm(savedProfile);
      setProfileImagePreview(getFreshAvatar(savedProfile) || fallbackAdminAvatar);
      setProfileImageFile(null);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = "";
      }
      updateStoredAdminProfile(savedProfile);
      setProfileMessage(data.message || "Profile updated successfully.");
    } catch (saveError) {
      setProfileError(friendlyRequestError(saveError, "Failed to save profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      setSavingPassword(true);
      setPasswordMessage("");
      setPasswordError("");

      const response = await fetch(buildApiUrl("/api/admin/change-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPasswordForm(initialPasswordForm);
      setPasswordMessage(data.message || "Password updated successfully.");
    } catch (saveError) {
      setPasswordError(saveError.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleProfileImageError = (event) => {
    if (event.currentTarget.src.endsWith(fallbackAdminAvatar)) {
      return;
    }

    event.currentTarget.src = fallbackAdminAvatar;
    setProfileImagePreview(fallbackAdminAvatar);
  };

  return (
    <AdminLayout title="Admin Profile">
      <div className="admin-profile__grid">
        <section className="admin-profile__card admin-profile__card--main">
          <h2 className="admin-profile__card-title">Personal Information</h2>

          <div className="admin-profile__media-row">
            <img
              key={profileImagePreview || profileForm.avatar || fallbackAdminAvatar}
              src={profileImagePreview || resolveAssetUrl(profileForm.avatar) || fallbackAdminAvatar}
              alt={profileForm.name || "Admin User"}
              className="admin-profile__avatar"
              onError={handleProfileImageError}
            />
            <div>
              <p className="admin-profile__media-title">Profile Picture</p>
              <p className="admin-profile__media-text">JPG, GIF or PNG. Max size 800K</p>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="admin-profile__upload-input"
                onChange={handleProfileImageChange}
              />
              <button type="button" className="admin-profile__upload-link" onClick={() => profileImageInputRef.current?.click()}>
                Upload New Picture
              </button>
              {profileImageFile ? <p className="admin-profile__media-text">Selected: {profileImageFile.name}. Save profile to apply it.</p> : null}
            </div>
          </div>

          {profileError ? <p className="admin-profile__status admin-profile__status--error">{profileError}</p> : null}
          {profileMessage ? <p className="admin-profile__status admin-profile__status--success">{profileMessage}</p> : null}

          <div className="admin-profile__form-grid">
            <label className="admin-profile__field">
              <span>Full Name</span>
              <input type="text" value={profileForm.name} onChange={(event) => handleProfileChange("name", event.target.value)} disabled={loading} />
            </label>

            <label className="admin-profile__field">
              <span>Email Address</span>
              <input type="email" value={profileForm.email} onChange={(event) => handleProfileChange("email", event.target.value)} disabled={loading} />
            </label>

            <label className="admin-profile__field admin-profile__field--full">
              <span>Phone Number</span>
              <input type="text" value={profileForm.phone} onChange={(event) => handleProfileChange("phone", event.target.value)} disabled={loading} />
            </label>
          </div>

          <div className="admin-profile__actions">
            <button type="button" className="admin-profile__save-button" onClick={handleProfileSave} disabled={savingProfile || loading}>
              <Save size={14} />
              <span>{savingProfile ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </section>

        <section className="admin-profile__card admin-profile__card--side">
          <div className="admin-profile__side-head">
            <Lock size={16} />
            <h2 className="admin-profile__card-title">Change Password</h2>
          </div>

          {passwordError ? <p className="admin-profile__status admin-profile__status--error">{passwordError}</p> : null}
          {passwordMessage ? <p className="admin-profile__status admin-profile__status--success">{passwordMessage}</p> : null}

          <div className="admin-profile__password-grid">
            <label className="admin-profile__field">
              <span>Old Password</span>
              <input
                type="password"
                placeholder="Enter Old Password"
                value={passwordForm.oldPassword}
                onChange={(event) => handlePasswordChange("oldPassword", event.target.value)}
              />
            </label>

            <label className="admin-profile__field">
              <span>New Password</span>
              <input
                type="password"
                placeholder="Enter New Password"
                value={passwordForm.newPassword}
                onChange={(event) => handlePasswordChange("newPassword", event.target.value)}
              />
            </label>

            <label className="admin-profile__field">
              <span>Confirm New Password</span>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(event) => handlePasswordChange("confirmPassword", event.target.value)}
              />
            </label>
          </div>

          <button type="button" className="admin-profile__update-button" onClick={handlePasswordSave} disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </section>
      </div>
    </AdminLayout>
  );
}
