import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, TrendingUp, ThumbsUp, MessageCircle, Clock, Plus, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  created_at: string;
  user: { name: string; email: string };
  replies: { count: number }[];
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const initials = (name: string) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'Strategy' });

  const categories = ['All', 'Strategy', 'Risk Management', 'Automation', 'Education', 'Analysis', 'News'];
  const token = localStorage.getItem('token') || '';

  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAllDiscussions(token);
      setDiscussions(data.discussions || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load discussions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDiscussions(); }, [fetchDiscussions]);

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      await api.createDiscussion(token, newDiscussion);
      setNewDiscussion({ title: '', content: '', category: 'Strategy' });
      setIsDialogOpen(false);
      toast({ title: 'Posted!', description: 'Your discussion is live.' });
      fetchDiscussions();
    } catch {
      toast({ title: 'Error', description: 'Failed to create discussion', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = discussions.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const replyCount = (d: Discussion) => d.replies?.[0]?.count ?? 0;
  const isHot = (d: Discussion) => d.likes > 20 || replyCount(d) > 10;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with traders and share insights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Discussions</CardTitle>
              <MessageSquare className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{discussions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active conversations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">High community activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Search + New */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search discussions..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" />New Discussion</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>Share your thoughts with the community</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="What's your discussion about?"
                    value={newDiscussion.title}
                    onChange={e => setNewDiscussion({ ...newDiscussion, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={newDiscussion.category}
                    onChange={e => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea placeholder="Share your thoughts in detail..." rows={6}
                    value={newDiscussion.content}
                    onChange={e => setNewDiscussion({ ...newDiscussion, content: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateDiscussion} disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Discussion
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <Badge key={cat} variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Badge>
          ))}
        </div>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
            <CardDescription>{filtered.length} {filtered.length === 1 ? 'discussion' : 'discussions'} found</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(d => (
                  <div key={d.id} onClick={() => navigate(`/discussion/${d.id}`)}
                    className="p-4 border border-white/[0.05] rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer transition-all group">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{initials(d.user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">{d.title}</h3>
                          {isHot(d) && <Badge variant="destructive" className="text-xs">HOT</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.content}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{d.user?.name}</span>
                          <Badge variant="secondary" className="text-xs">{d.category}</Badge>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(d.created_at)}</div>
                          <div className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{replyCount(d)} replies</div>
                          <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{d.likes} likes</div>
                          <div className="flex items-center gap-1"><Users className="w-3 h-3" />{d.views} views</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && !loading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No discussions found. Be the first to start one!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
