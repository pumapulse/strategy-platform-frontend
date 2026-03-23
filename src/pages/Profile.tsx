import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { User, Mail, Calendar, Camera, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const Profile = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || '');
      setBio(u.bio || '');
      setAvatarPreview(u.avatar_url || null);
    }
    if (token) {
      api.getProfile(token).then(data => {
        const u = data.user;
        setUser(u);
        setName(u.name || '');
        setBio(u.bio || '');
        setAvatarPreview(u.avatar_url || null);
      }).catch(() => {});
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let avatar_url = user?.avatar_url;

      if (avatarFile) {
        setUploadingAvatar(true);
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = e => {
            const result = e.target?.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
        const res = await api.uploadAvatar(token, base64, avatarFile.type);
        avatar_url = res.avatar_url;
        setUploadingAvatar(false);
      }

      const res = await api.updateProfile(token, { name, bio, avatar_url });
      const updated = { ...user, ...res.user };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setAvatarFile(null);
      window.dispatchEvent(new Event('user-updated'));
      toast({ title: 'Saved!', description: 'Your profile has been updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSaving(false);
      setUploadingAvatar(false);
    }
  };

  const initials = (n: string) =>
    n?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-40";

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-violet-500" />
            <span className="text-xs font-bold tracking-[0.25em] text-violet-400 uppercase">Account</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Profile Settings</h1>
          <p className="text-white/40 text-base">Manage your account information</p>
        </div>

        <div className="grid gap-5">
          {/* Personal Info */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8">
            <p className="text-white font-bold text-base mb-1">Personal Information</p>
            <p className="text-white/30 text-sm mb-8">Update your profile photo and details</p>

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/[0.08] border-2 border-white/[0.1] flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white/50">{initials(name)}</span>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-md hover:bg-violet-400 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <div>
                <p className="font-semibold text-white">{name || 'Your Name'}</p>
                <p className="text-sm text-white/40 mt-0.5">{user?.email}</p>
                <button onClick={() => fileRef.current?.click()} className="text-xs text-violet-400 hover:text-violet-300 mt-2 block transition-colors">
                  {avatarPreview ? 'Change photo' : 'Upload photo'}
                </button>
                <p className="text-xs text-white/30 mt-0.5">JPG, PNG or GIF · Max 5MB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />Full Name
                </label>
                <input id="name" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />Email
                </label>
                <input id="email" type="email" value={user?.email || ''} disabled className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Bio</label>
                <textarea
                  id="bio"
                  placeholder="Tell the community about yourself..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />Member Since
                </label>
                <input
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                  disabled
                  className={inputClass}
                />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-semibold text-sm transition-all">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" />{uploadingAvatar ? 'Uploading photo...' : 'Saving...'}</>
                : <><Check className="w-4 h-4" />Save Changes</>
              }
            </button>
          </div>

          {/* Trading Preferences */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8">
            <p className="text-white font-bold text-base mb-1">Trading Preferences</p>
            <p className="text-white/30 text-sm mb-8">Customize your trading experience</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Risk Tolerance</label>
                <input id="risk" placeholder="Medium" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Trading Capital</label>
                <input id="capital" placeholder="$10,000" className={inputClass} />
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                Update Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
