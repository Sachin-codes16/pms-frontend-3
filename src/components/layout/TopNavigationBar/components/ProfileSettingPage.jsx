import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import { getCookie } from 'cookies-next';

function getManagerId() {
  try {
    const raw = getCookie('_LAHOMES_AUTH_KEY_')?.toString();
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.manager_id ?? parsed?.user_id ?? parsed?.id ?? null;
  } catch {
    return null;
  }
}

const ProfileSettingPage = () => {
  const [isOpen, setIsOpen]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [updating, setUpdating]         = useState(false);
  const [error, setError]               = useState(null);
  const [successMsg, setSuccessMsg]     = useState(null);

  // ── Profile photo state ──────────────────────────────────────────
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef(null);
  // ────────────────────────────────────────────────────────────────

  const [form, setForm] = useState({
    firstName   : '',
    lastName    : '',
    email       : '',
    phone       : '',
    dob         : '',
    username    : '',
    position    : '',
    department  : '',
    managerId   : '',
    oldPassword : '',
    newPassword : '',
  });

  const managerId = getManagerId();

  // ── Fetch profile on component mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!managerId) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setImageLoadError(false);

    axios.get(`${API_BASE_URL}/marketing/manager/get/`, {
      params  : { manager_id: managerId },
      headers : { Authorization: `Bearer ${AUTH_TOKEN}` },
    })
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;

        const nameParts = (d.name ?? '').trim().split(' ');
        const firstName = nameParts[0] ?? '';
        const lastName  = nameParts.slice(1).join(' ') ?? '';

        const phoneRaw = d.phoneNumber ?? '';

        let dobFormatted = '';
        if (d.dob) {
          const [y, m, day] = d.dob.split('-');
          dobFormatted = `${day} / ${m} / ${y}`;
        }

        // ── Set profile picture from API with proper URL handling ──
        const profilePic = d.profile_picture ?? d.profilePicture;
        
        if (profilePic) {
          // Handle different URL formats
          let fullUrl;
          
          if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
            // Already a full URL
            fullUrl = profilePic;
          } else if (profilePic.startsWith('data:image')) {
            // Base64 data URL
            fullUrl = profilePic;
          } else {
            // Relative path - ensure proper construction
            // Remove leading slash from profilePic if it exists to avoid double slashes
            const cleanPath = profilePic.startsWith('/') ? profilePic.substring(1) : profilePic;
            // Ensure API_BASE_URL doesn't end with slash
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
            fullUrl = `${baseUrl}/${cleanPath}`;
          }
          
          setProfilePicture(fullUrl);
        } else {
          setProfilePicture(null);
        }

        setForm({
          firstName  : firstName,
          lastName   : lastName,
          email      : d.email      ?? '',
          phone      : phoneRaw,
          dob        : dobFormatted,
          username   : d.name       ?? '',
          position   : d.department ?? '',
          department : d.department ?? '',
          managerId  : String(d.managerId ?? d.manager_id ?? managerId ?? ''),
          oldPassword: '',
          newPassword: '',
        });
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [managerId]); // Fetch on mount when managerId is available

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ── Profile photo handlers ───────────────────────────────────────

  /** Opens the hidden file picker */
  const handleUpdatePhoto = () => {
    fileInputRef.current?.click();
  };

  /** Converts selected file → base64, stores for preview & API upload */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result); // base64 data-URL → preview + sent to API
      setImageLoadError(false);
      setError(null);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  /** Clears the photo locally; will send null to API on next Update click */
  const handleRemovePhoto = () => {
    setProfilePicture(null);
    setImageLoadError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** Handle image load errors */
  const handleImageError = (e) => {
    console.error('Profile image failed to load:', e.target.src);
    setImageLoadError(true);
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleUpdate = async () => {
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let dobForApi = null;
      if (form.dob) {
        const parts = form.dob.replace(/\s/g, '').split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          dobForApi = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          dobForApi = form.dob;
        }
      }

      // Safely resolve manager_id — never send 0
      const resolvedManagerId = Number(form.managerId) || Number(managerId) || null;
      if (!resolvedManagerId) {
        setError('Manager ID is missing. Please refresh and try again.');
        return;
      }

      const body = {
        manager_id      : resolvedManagerId,
        name            : `${form.firstName} ${form.lastName}`.trim(),
        dob             : dobForApi,
        department      : form.department,
        phone_number    : form.phone,
        email           : form.email || null,
        profile_picture : profilePicture ?? null,
        permissions     : {
          lead     : true,
          property : true,
        },
      };

      const res = await axios.put(
        `${API_BASE_URL}/marketing/manager/update/`,
        body,
        {
          headers: {
            Authorization  : `Bearer ${AUTH_TOKEN}`,
            'Content-Type' : 'application/json',
          },
        }
      );

      if (res.data?.status) {
        setSuccessMsg(res.data?.message ?? 'Profile updated successfully!');
        setForm(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
        setImageLoadError(false);
      } else {
        setError(res.data?.message ?? 'Update failed.');
      }

    } catch (err) {
      console.error('Update error:', err.response?.data ?? err.message);
      setError(
        err.response?.data?.message ??
        err.response?.data?.detail  ??
        JSON.stringify(err.response?.data) ??
        'Update failed. Please try again.'
      );
    } finally {
      setUpdating(false);
    }
  };

  // Get user initials for fallback
  const getUserInitials = () => {
    const firstName = form.firstName || '';
    const lastName = form.lastName || '';
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return 'U'; // Default to 'U' for User
  };

  // Determine which photo to display - null if no profile picture or error occurred
  const displayPhoto = imageLoadError ? null : profilePicture;

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={profileBtn}>
        {displayPhoto ? (
          <img 
            src={displayPhoto} 
            alt="profile" 
            style={profileImg}
            onError={(e) => {
              console.error('Header profile image failed to load:', e.target.src);
              setImageLoadError(true);
            }}
          />
        ) : (
          <div style={profileInitials}>
            {getUserInitials()}
          </div>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {isOpen && (
        <div style={overlay} onClick={() => setIsOpen(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>

            <div style={headerStyle}>
              <h2 style={titleStyle}>Profile Setting</h2>
              <button style={closeBtn} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div style={content}>
              <div style={formContainer}>

                {successMsg && (
                  <div style={successBanner}>✅ {successMsg}</div>
                )}

                {error && (
                  <div style={errorBanner}>❌ {error}</div>
                )}

                {loading
                  ? <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading profile...</div>
                  : (
                  <>
                    {/* Profile Photo */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Profile Photo</label>
                      <div style={inputArea}>
                        <div style={photoRow}>
                          {displayPhoto ? (
                            <img
                              src={displayPhoto}
                              alt="profile"
                              style={profilePhoto}
                              onError={handleImageError}
                            />
                          ) : (
                            <div style={profilePhotoPlaceholder}>
                              {getUserInitials()}
                            </div>
                          )}
                          {/* Remove: clears photo state */}
                          <button
                            style={removeLink}
                            onClick={handleRemovePhoto}
                            disabled={!profilePicture}
                            title="Remove profile photo"
                          >
                            Remove
                          </button>
                          {/* Update: opens file picker */}
                          <button
                            style={updateLinkStyle}
                            onClick={handleUpdatePhoto}
                            title="Choose a new photo"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Manager ID — read only */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Manager ID</label>
                      <div style={inputArea}>
                        <input
                          type="text"
                          value={form.managerId}
                          readOnly
                          style={{ ...inputFull, backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                        />
                      </div>
                    </div>

                    {/* First Name & Last Name */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>First Name & Last Name</label>
                      <div style={inputArea}>
                        <div style={twoColumns}>
                          <input type="text" value={form.firstName} onChange={handleChange('firstName')} style={inputStyle} placeholder="First Name" />
                          <input type="text" value={form.lastName}  onChange={handleChange('lastName')}  style={inputStyle} placeholder="Last Name" />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Email Address</label>
                      <div style={inputArea}>
                        <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Enter email" style={inputFull} />
                      </div>
                    </div>

                    {/* Department */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Department</label>
                      <div style={inputArea}>
                        <input type="text" value={form.department} readOnly style={{ ...inputFull, backgroundColor: '#f3f4f6', color: '#9ca3af' }} />
                      </div>
                    </div>

                    {/* Contact Number - WITHOUT country code */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Contact Number</label>
                      <div style={inputArea}>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={handleChange('phone')}
                          placeholder="Enter contact number"
                          style={inputFull}
                        />
                      </div>
                    </div>

                    {/* Date Of Birth */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Date Of Birth</label>
                      <div style={inputArea}>
                        <input type="text" value={form.dob} onChange={handleChange('dob')} placeholder="DD / MM / YYYY" style={inputFull} />
                      </div>
                    </div>

                    {/* Username */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Username</label>
                      <div style={inputArea}>
                        <input type="text" value={form.username} onChange={handleChange('username')} style={inputFull} />
                      </div>
                    </div>

                    {/* Position */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Position</label>
                      <div style={inputArea}>
                        <input type="text" value={form.position} onChange={handleChange('position')} style={inputFull} />
                      </div>
                    </div>

                    {/* Change Password */}
                    <div style={rowStyle}>
                      <label style={labelStyle}>Change Password</label>
                      <div style={inputArea}>
                        <div style={passwordRow}>
                          <input type="password" value={form.oldPassword} onChange={handleChange('oldPassword')} style={inputPassword} placeholder="Old Password" />
                          <input type="password" value={form.newPassword} onChange={handleChange('newPassword')} style={inputPassword} placeholder="New Password" />
                          <a href="#" style={forgotLink}>Forgot password?</a>
                        </div>
                      </div>
                    </div>

                    {/* Update Button */}
                    <div style={buttonContainer}>
                      <button
                        style={{
                          ...updateBtn,
                          opacity: updating ? 0.7 : 1,
                          cursor : updating ? 'not-allowed' : 'pointer',
                        }}
                        onClick={handleUpdate}
                        disabled={updating}
                      >
                        {updating ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ── Styles ── */
const profileBtn      = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '12px' };
const profileImg      = { width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' };
const profileInitials = { 
  width: 30, 
  height: 30, 
  borderRadius: '50%', 
  backgroundColor: '#5D7186', 
  color: '#ffffff', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: 12, 
  fontWeight: 600 
};
const overlay         = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '20px' };
const modal           = { backgroundColor: '#ffffff', borderRadius: 8, width: '100%', minHeight: 'auto', display: 'flex', flexDirection: 'column', margin: '20px auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
const headerStyle     = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' };
const titleStyle      = { fontSize: 24, fontWeight: 600, color: '#1f2937', margin: 0 };
const closeBtn        = { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, fontSize: 28, lineHeight: 1, width: 36, height: 36, transition: 'color 0.2s' };
const content         = { flex: 1, padding: '40px', backgroundColor: '#ffffff' };
const formContainer   = { maxWidth: 900, margin: '0 auto' };
const rowStyle        = { display: 'flex', alignItems: 'flex-start', marginBottom: 28, gap: 40 };
const labelStyle      = { fontSize: 14, fontWeight: 600, color: '#374151', minWidth: 180, textAlign: 'left', paddingTop: 12 };
const inputArea       = { flex: 1, maxWidth: 600 };
const photoRow        = { display: 'flex', alignItems: 'center', gap: 20 };
const profilePhoto    = { width: 70, height: 70, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' };
const profilePhotoPlaceholder = { 
  width: 70, 
  height: 70, 
  borderRadius: 8, 
  backgroundColor: '#5D7186', 
  color: '#ffffff', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: 24, 
  fontWeight: 600,
  border: '1px solid #e5e7eb'
};
const removeLink      = { background: 'none', border: 'none', color: '#ef4444', fontSize: 14, cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'opacity 0.2s' };
const updateLinkStyle = { background: 'none', border: 'none', color: '#3b82f6', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: 0, textDecoration: 'underline', transition: 'opacity 0.2s' };
const inputFull       = { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff', transition: 'border-color 0.2s' };
const twoColumns      = { display: 'flex', gap: 16 };
const inputStyle      = { flex: 1, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, color: '#374151', outline: 'none', backgroundColor: '#ffffff', transition: 'border-color 0.2s' };
const passwordRow     = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' };
const inputPassword   = { flex: 1, minWidth: 200, maxWidth: 230, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, color: '#374151', outline: 'none', backgroundColor: '#ffffff', transition: 'border-color 0.2s' };
const forgotLink      = { color: '#3b82f6', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' };
const buttonContainer = { marginTop: 40, display: 'flex', justifyContent: 'flex-start' };
const updateBtn       = { backgroundColor: '#5D7186', color: '#ffffff', border: 'none', borderRadius: 8, padding: '14px 48px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const successBanner   = { backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, border: '1px solid #a7f3d0' };
const errorBanner     = { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 20px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500, border: '1px solid #fecaca' };

export default ProfileSettingPage;