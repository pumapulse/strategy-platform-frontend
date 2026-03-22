import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    // Fetch fresh from server
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

      // Upload avatar first if changed
      if (avatarFile) {
        setUploadingAvatar(true);
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = e => {
            const result = e.target?.result as string;
            resolve(result.split(',')[1]); // strip data:...;base64,
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

      // Dispatch event so Header picks up the change immediately
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid gap-6">
          {/* Avatar + Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile photo and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Avatar upload */}
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">{initials(name)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{name || 'Your Name'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-primary hover:underline mt-2 block"
                  >
                    {avatarPreview ? 'Change photo' : 'Upload photo'}
                  </button>
                  <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or GIF · Max 5MB</p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell the community about yourself..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()} disabled />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{uploadingAvatar ? 'Uploading photo...' : 'Saving...'}</>
                  : <><Check className="w-4 h-4" />Save Changes</>
                }
              </Button>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>Customize your trading experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Tolerance</Label>
                <Input id="risk" placeholder="Medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capital">Trading Capital</Label>
                <Input id="capital" placeholder="$10,000" />
              </div>
              <Button variant="outline">Update Preferences</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
