<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
<<<<<<< HEAD
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, Send, Loader2, UserPlus, UserCheck, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Reply {
  id: string;
  content: string;
  likes: number;
  created_at: string;
  user: { id: string; name: string };
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  created_at: string;
  user: { id: string; name: string };
  replies: Reply[];
}

interface FollowStatus {
  following: number;
  followers: number;
  isFollowing: boolean;
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

const DiscussionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [followPending, setFollowPending] = useState(false);

  const token = localStorage.getItem('token') || '';
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchDiscussion = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getDiscussionById(token, id);
      setDiscussion(data.discussion);
    } catch {
      toast({ title: 'Error', description: 'Failed to load discussion', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => { fetchDiscussion(); }, [fetchDiscussion]);

  // Load follow status once we have the author id
  useEffect(() => {
    if (!discussion?.user?.id || !token) return;
    if (discussion.user.id === currentUser?.id) return; // don't show follow for own posts
    api.getFollowStatus(token, discussion.user.id)
      .then(setFollowStatus)
      .catch(() => {});
  }, [discussion?.user?.id]);

  const handleLike = async () => {
    if (!id || likePending) return;
    try {
      setLikePending(true);
      const data = await api.likeDiscussion(token, id);
      setLiked(data.liked);
      setDiscussion(prev => prev ? {
        ...prev,
        likes: data.liked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
      } : prev);
    } catch {
      toast({ title: 'Error', description: 'Failed to like', variant: 'destructive' });
    } finally {
      setLikePending(false);
    }
  };

  const handleFollow = async () => {
    if (!discussion?.user?.id || followPending) return;
    try {
      setFollowPending(true);
      const data = await api.toggleFollow(token, discussion.user.id);
      setFollowStatus(prev => prev ? {
        ...prev,
        isFollowing: data.following,
        followers: data.following ? prev.followers + 1 : Math.max(0, prev.followers - 1),
      } : prev);
      toast({
        title: data.following ? 'Following!' : 'Unfollowed',
        description: data.following
          ? `You are now following ${discussion.user.name}`
          : `You unfollowed ${discussion.user.name}`,
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to update follow', variant: 'destructive' });
    } finally {
      setFollowPending(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !id) {
      toast({ title: 'Error', description: 'Please write a reply', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      await api.createReply(token, id, replyContent);
      setReplyContent('');
      toast({ title: 'Posted!', description: 'Your reply has been added.' });
      fetchDiscussion();
    } catch {
      toast({ title: 'Error', description: 'Failed to post reply', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-muted-foreground">Discussion not found.</p>
          <Button onClick={() => navigate('/community')}>Back to Community</Button>
        </div>
      </div>
    );
  }

  const isOwnPost = discussion.user?.id === currentUser?.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-4xl">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/community')}>
          <ArrowLeft className="w-4 h-4" />Back to Community
        </Button>

        {/* Discussion */}
=======
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reply {
  id: number;
  author: string;
  authorInitials: string;
  content: string;
  timeAgo: string;
  likes: number;
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  category: string;
  replies: number;
  likes: number;
  views: number;
  timeAgo: string;
  isHot: boolean;
}

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [liked, setLiked] = useState(false);

  // Mock discussion data
  const [discussion, setDiscussion] = useState<Discussion>({
    id: parseInt(id || '1'),
    title: 'Best strategies for volatile markets?',
    content: 'Looking for advice on trading during high volatility periods. What indicators do you use? I\'ve been trading for about 6 months now and I find it particularly challenging when the market becomes very volatile. I\'ve tried using RSI and MACD but I\'m not getting consistent results. Would love to hear from experienced traders about their approach to volatile markets and which indicators they find most reliable.',
    author: 'John Doe',
    authorInitials: 'JD',
    category: 'Strategy',
    replies: 24,
    likes: 45,
    views: 320,
    timeAgo: '2 hours ago',
    isHot: true,
  });

  const [replies, setReplies] = useState<Reply[]>([
    {
      id: 1,
      author: 'Sarah Wilson',
      authorInitials: 'SW',
      content: 'Great question! I usually combine Bollinger Bands with ATR (Average True Range) during volatile periods. The ATR helps me adjust my stop losses dynamically based on market volatility.',
      timeAgo: '1 hour ago',
      likes: 12,
    },
    {
      id: 2,
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      content: 'In my experience, volume analysis is crucial during volatile markets. I look for volume spikes combined with price action to confirm trends. Also, I reduce my position sizes by 50% when volatility increases.',
      timeAgo: '45 minutes ago',
      likes: 8,
    },
    {
      id: 3,
      author: 'Emily Chen',
      authorInitials: 'EC',
      content: 'I\'ve found that using multiple timeframe analysis helps a lot. Check the 1H, 4H, and Daily charts together. If they all align, the signal is much stronger even in volatile conditions.',
      timeAgo: '30 minutes ago',
      likes: 15,
    },
    {
      id: 4,
      author: 'David Lee',
      authorInitials: 'DL',
      content: 'Don\'t forget about the VIX! It\'s a great indicator for overall market volatility. When VIX is high, I switch to more conservative strategies and focus on risk management rather than profit maximization.',
      timeAgo: '20 minutes ago',
      likes: 10,
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setDiscussion({
      ...discussion,
      likes: liked ? discussion.likes - 1 : discussion.likes + 1,
    });
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a reply',
        variant: 'destructive',
      });
      return;
    }

    const newReply: Reply = {
      id: replies.length + 1,
      author: user?.name || 'Anonymous',
      authorInitials: user?.name?.split(' ').map((n: string) => n[0]).join('') || 'AN',
      content: replyContent,
      timeAgo: 'Just now',
      likes: 0,
    };

    setReplies([...replies, newReply]);
    setDiscussion({
      ...discussion,
      replies: discussion.replies + 1,
    });
    setReplyContent('');

    toast({
      title: 'Success!',
      description: 'Your reply has been posted',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/community')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Button>

        {/* Discussion Card */}
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
<<<<<<< HEAD
                <AvatarFallback className="text-lg">{initials(discussion.user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1 className="text-2xl font-bold">{discussion.title}</h1>
                      {(discussion.likes > 20 || discussion.replies?.length > 10) && (
                        <Badge variant="destructive">HOT</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{discussion.user?.name}</span>
                      {followStatus && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {followStatus.followers} followers
                        </span>
                      )}
                      <Badge variant="secondary">{discussion.category}</Badge>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(discussion.created_at)}</div>
                      <div className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{discussion.replies?.length ?? 0} replies</div>
                      <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{discussion.likes} likes</div>
                    </div>
                  </div>

                  {/* Follow button */}
                  {!isOwnPost && followStatus !== null && (
                    <Button
                      variant={followStatus.isFollowing ? 'outline' : 'default'}
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={handleFollow}
                      disabled={followPending}
                    >
                      {followPending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : followStatus.isFollowing
                          ? <UserCheck className="w-4 h-4" />
                          : <UserPlus className="w-4 h-4" />
                      }
                      {followStatus.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
=======
                <AvatarFallback className="text-lg">{discussion.authorInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{discussion.title}</h1>
                  {discussion.isHot && (
                    <Badge variant="destructive">HOT</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{discussion.author}</span>
                  <Badge variant="secondary">{discussion.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {discussion.timeAgo}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {discussion.replies} replies
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {discussion.likes} likes
                  </div>
                </div>
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
              </div>
            </div>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="text-base leading-relaxed mb-4 whitespace-pre-wrap">{discussion.content}</p>
            <Button variant={liked ? 'default' : 'outline'} size="sm" className="gap-2"
              onClick={handleLike} disabled={likePending}>
              {likePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
              {liked ? 'Liked' : 'Like'} · {discussion.likes}
            </Button>
          </CardContent>
        </Card>

        {/* Replies */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold">{discussion.replies?.length ?? 0} Replies</h2>
          </CardHeader>
          <CardContent>
            {discussion.replies?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No replies yet. Be the first!</p>
            ) : (
              <div className="space-y-6">
                {discussion.replies.map(reply => (
                  <div key={reply.id} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{initials(reply.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-accent rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{reply.user?.name}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(reply.created_at)}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 ml-4">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                          <ThumbsUp className="w-3 h-3" />{reply.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply form */}
=======
            <p className="text-base leading-relaxed mb-4">{discussion.content}</p>
            <div className="flex items-center gap-2">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4" />
                {liked ? 'Liked' : 'Like'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold">{replies.length} Replies</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{reply.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-accent rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{reply.author}</span>
                        <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-4">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <ThumbsUp className="w-3 h-3" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Add Your Reply</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
<<<<<<< HEAD
              <Textarea placeholder="Share your thoughts..." value={replyContent}
                onChange={e => setReplyContent(e.target.value)} rows={4} />
              <div className="flex justify-end">
                <Button onClick={handleReply} disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
=======
              <Textarea
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply} className="gap-2">
                  <Send className="w-4 h-4" />
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
                  Post Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscussionDetail;
