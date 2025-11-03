import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Autorenew as AutorenewIcon,
} from '@mui/icons-material';

const SocialMediaManagement = () => {
  // State for platforms
  const [platforms, setPlatforms] = useState({
    twitter: {
      name: 'Twitter/X',
      icon: <TwitterIcon />,
      connected: false,
      color: '#1DA1F2',
    },
    facebook: {
      name: 'Facebook',
      icon: <FacebookIcon />,
      connected: false,
      color: '#4267B2',
    },
    instagram: {
      name: 'Instagram',
      icon: <InstagramIcon />,
      connected: false,
      color: '#E1306C',
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      connected: false,
      color: '#0077B5',
    },
    tiktok: {
      name: 'TikTok',
      icon: <span>🎵</span>,
      connected: false,
      color: '#000000',
    },
    youtube: {
      name: 'YouTube',
      icon: <YouTubeIcon />,
      connected: false,
      color: '#FF0000',
    },
  });

  // State for posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // State for current tab
  const [currentTab, setCurrentTab] = useState(0);

  // State for post creation
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [],
    scheduled_time: '',
    tone: 'professional',
    include_hashtags: true,
    include_emojis: true,
  });

  // State for AI generation
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  // State for analytics
  const [analytics, setAnalytics] = useState({
    total_posts: 0,
    total_engagement: 0,
    avg_engagement_rate: 0,
    top_platform: 'N/A',
  });

  // State for trending topics
  const [trendingTopics, setTrendingTopics] = useState([]);

  // Dialog states
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch platforms status
  const fetchPlatforms = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/social/platforms'
      );
      if (response.ok) {
        const data = await response.json();
        setPlatforms((prev) => {
          const updated = { ...prev };
          Object.keys(data).forEach((platform) => {
            if (updated[platform]) {
              updated[platform].connected = data[platform].connected;
            }
          });
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to fetch platforms:', err);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/social/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setAnalytics(data.analytics || analytics);
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending topics
  const fetchTrending = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/social/trending?platform=twitter'
      );
      if (response.ok) {
        const data = await response.json();
        setTrendingTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Failed to fetch trending:', err);
    }
  };

  // Connect platform
  const connectPlatform = async (platform) => {
    try {
      const response = await fetch('http://localhost:8000/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });

      if (response.ok) {
        setSuccessMessage(
          `${platforms[platform].name} connected successfully!`
        );
        fetchPlatforms();
      } else {
        setError(`Failed to connect ${platforms[platform].name}`);
      }
    } catch (err) {
      setError(`Error connecting ${platforms[platform].name}`);
    }
  };

  // Generate AI content
  const generateAIContent = async () => {
    if (!aiTopic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setGeneratingAI(true);
    try {
      const selectedPlatforms = newPost.platforms;
      if (selectedPlatforms.length === 0) {
        setError('Please select at least one platform');
        setGeneratingAI(false);
        return;
      }

      const response = await fetch(
        'http://localhost:8000/api/social/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: aiTopic,
            platform: selectedPlatforms[0], // Use first platform for generation
            tone: newPost.tone,
            include_hashtags: newPost.include_hashtags,
            include_emojis: newPost.include_emojis,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNewPost((prev) => ({ ...prev, content: data.content }));
        setSuccessMessage('AI content generated successfully!');
      } else {
        setError('Failed to generate content');
      }
    } catch (err) {
      setError('Error generating content');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Create social post
  const createPost = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!newPost.content.trim()) {
      setError('Please enter content for the post');
      return;
    }
    if (newPost.platforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost.content,
          platforms: newPost.platforms,
          scheduled_time: newPost.scheduled_time || null,
          tone: newPost.tone,
          include_hashtags: newPost.include_hashtags,
          include_emojis: newPost.include_emojis,
        }),
      });

      if (response.ok) {
        setNewPost({
          content: '',
          platforms: [],
          scheduled_time: '',
          tone: 'professional',
          include_hashtags: true,
          include_emojis: true,
        });
        setSuccessMessage('Post created successfully');
        fetchPosts();
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      setError('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  // Cross-post
  const handleCrossPost = async () => {
    const selectedPlatforms = Object.keys(platforms).filter((p) =>
      newPost.platforms.includes(p)
    );

    if (selectedPlatforms.length < 2) {
      setError('Select at least 2 platforms for cross-posting');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:8000/api/social/cross-post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newPost.content,
            platforms: selectedPlatforms,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage(
          `Cross-posted to ${selectedPlatforms.length} platforms!`
        );
        fetchPosts();
      } else {
        setError('Failed to cross-post');
      }
    } catch (err) {
      setError('Error cross-posting');
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/social/posts/${postId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setSuccessMessage('Post deleted');
        fetchPosts();
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  // View analytics
  const viewAnalytics = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/social/posts/${postId}/analytics`
      );
      if (response.ok) {
        const analyticsData = await response.json();
        setSelectedPost({ id: postId, ...analyticsData });
        setAnalyticsDialogOpen(true);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
    }
  };

  // Auto-refresh - but don't include analytics in dependency array to avoid infinite loops
  useEffect(() => {
    // Define functions inside useEffect to avoid dependency issues
    const refreshData = async () => {
      try {
        // Fetch platforms
        const platformsRes = await fetch(
          'http://localhost:8000/api/social/platforms'
        );
        if (platformsRes.ok) {
          const data = await platformsRes.json();
          setPlatforms((prev) => {
            const updated = { ...prev };
            Object.keys(data).forEach((platform) => {
              if (updated[platform]) {
                updated[platform].connected = data[platform].connected;
              }
            });
            return updated;
          });
        }

        // Fetch posts
        setLoading(true);
        const postsRes = await fetch('http://localhost:8000/api/social/posts');
        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.posts || []);
          setAnalytics(data.analytics || {});
        }
        setLoading(false);

        // Fetch trending
        const trendingRes = await fetch(
          'http://localhost:8000/api/social/trending?platform=twitter'
        );
        if (trendingRes.ok) {
          const data = await trendingRes.json();
          setTrendingTopics(data.topics || []);
        }
      } catch (err) {
        console.error('Error refreshing data:', err);
        setLoading(false);
      }
    };

    // Fetch immediately on component mount
    refreshData();

    // Then set up interval for periodic refresh (2 minutes instead of 30 seconds)
    const interval = setInterval(() => {
      refreshData();
    }, 120000); // Refresh every 2 minutes instead of 30 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run on mount/unmount

  // Render platform connection cards
  const renderPlatformCards = () => (
    <Grid container spacing={2}>
      {Object.entries(platforms).map(([key, platform]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card
            sx={{
              height: '100%',
              borderLeft: `4px solid ${platform.color}`,
              '&:hover': { boxShadow: 6 },
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ color: platform.color, fontSize: 32 }}>
                    {platform.icon}
                  </Box>
                  <Typography variant="h6">{platform.name}</Typography>
                </Box>
                {platform.connected ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Connected"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Disconnected"
                    color="default"
                    size="small"
                  />
                )}
              </Box>

              <Box mt={2}>
                <Button
                  variant={platform.connected ? 'outlined' : 'contained'}
                  fullWidth
                  onClick={() => connectPlatform(key)}
                  disabled={loading}
                  sx={{
                    borderColor: platform.color,
                    color: platform.connected ? platform.color : 'white',
                    bgcolor: platform.connected
                      ? 'transparent'
                      : platform.color,
                    '&:hover': {
                      bgcolor: platform.connected
                        ? 'transparent'
                        : platform.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  {platform.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Render post creation form
  const renderPostCreation = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Post
        </Typography>

        {/* AI Content Generator */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            AI Content Generator ✨
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter topic (e.g., 'AI automation benefits')"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Tone</InputLabel>
              <Select
                value={newPost.tone}
                label="Tone"
                onChange={(e) =>
                  setNewPost({ ...newPost, tone: e.target.value })
                }
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="humorous">Humorous</MenuItem>
                <MenuItem value="inspirational">Inspirational</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={generateAIContent}
              disabled={generatingAI || !aiTopic.trim()}
              startIcon={
                generatingAI ? (
                  <CircularProgress size={20} />
                ) : (
                  <AutorenewIcon />
                )
              }
            >
              Generate
            </Button>
          </Box>

          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newPost.include_hashtags}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      include_hashtags: e.target.checked,
                    })
                  }
                />
              }
              label="Include Hashtags"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newPost.include_emojis}
                  onChange={(e) =>
                    setNewPost({ ...newPost, include_emojis: e.target.checked })
                  }
                />
              }
              label="Include Emojis"
            />
          </FormGroup>
        </Box>

        {/* Post Content */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your post content here..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" color="textSecondary">
          {newPost.content.length} characters
        </Typography>

        {/* Platform Selection */}
        <Box mt={2} mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Select Platforms
          </Typography>
          <FormGroup row>
            {Object.entries(platforms).map(([key, platform]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={newPost.platforms.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewPost({
                          ...newPost,
                          platforms: [...newPost.platforms, key],
                        });
                      } else {
                        setNewPost({
                          ...newPost,
                          platforms: newPost.platforms.filter((p) => p !== key),
                        });
                      }
                    }}
                    disabled={!platform.connected}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {platform.icon}
                    <span>{platform.name}</span>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => createPost(true)}
            disabled={
              loading ||
              !newPost.content.trim() ||
              newPost.platforms.length === 0
            }
          >
            Publish Now
          </Button>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => setScheduleDialogOpen(true)}
            disabled={
              loading ||
              !newPost.content.trim() ||
              newPost.platforms.length === 0
            }
          >
            Schedule
          </Button>
          <Button
            variant="outlined"
            onClick={handleCrossPost}
            disabled={
              loading || !newPost.content.trim() || newPost.platforms.length < 2
            }
          >
            Cross-Post ({newPost.platforms.length} platforms)
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Render posts table
  const renderPostsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Content</TableCell>
            <TableCell>Platforms</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Scheduled</TableCell>
            <TableCell>Engagement</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="textSecondary">No posts yet</Typography>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                    {post.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    {post.platforms.map((p) => (
                      <Tooltip key={p} title={platforms[p]?.name || p}>
                        <Box sx={{ color: platforms[p]?.color }}>
                          {platforms[p]?.icon || p}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.status}
                    size="small"
                    color={
                      post.status === 'published'
                        ? 'success'
                        : post.status === 'scheduled'
                          ? 'info'
                          : post.status === 'failed'
                            ? 'error'
                            : 'default'
                    }
                  />
                </TableCell>
                <TableCell>{post.scheduled_time || 'N/A'}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {post.engagement || 0} interactions
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => viewAnalytics(post.id)}
                  >
                    <TrendingUpIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => deletePost(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render trending topics
  const renderTrending = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔥 Trending Topics
        </Typography>
        {trendingTopics.map((topic, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            borderBottom="1px solid #eee"
          >
            <Typography variant="body2">{topic.topic}</Typography>
            <Chip
              label={`${(topic.volume / 1000).toFixed(0)}K`}
              size="small"
              color="primary"
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  // Render analytics summary
  const renderAnalyticsSummary = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Posts
            </Typography>
            <Typography variant="h4">{analytics.total_posts}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Engagement
            </Typography>
            <Typography variant="h4">{analytics.total_engagement}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg Engagement Rate
            </Typography>
            <Typography variant="h4">
              {analytics.avg_engagement_rate.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Top Platform
            </Typography>
            <Typography variant="h4">{analytics.top_platform}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Social Media Management</Typography>
        <IconButton
          onClick={() => {
            fetchPlatforms();
            fetchPosts();
            fetchTrending();
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box mb={3}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab label="Platforms" />
          <Tab label="Create Post" />
          <Tab label="Posts" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Loading Bar */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Tab Content */}
      {currentTab === 0 && (
        <Box>
          {renderPlatformCards()}
          <Box mt={3}>{renderTrending()}</Box>
        </Box>
      )}

      {currentTab === 1 && renderPostCreation()}

      {currentTab === 2 && <Box>{renderPostsTable()}</Box>}

      {currentTab === 3 && <Box>{renderAnalyticsSummary()}</Box>}

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
      >
        <DialogTitle>Schedule Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="datetime-local"
            label="Schedule Time"
            value={newPost.scheduled_time}
            onChange={(e) =>
              setNewPost({ ...newPost, scheduled_time: e.target.value })
            }
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => createPost(false)}
            disabled={!newPost.scheduled_time}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog
        open={analyticsDialogOpen}
        onClose={() => setAnalyticsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post Analytics</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Content:</strong> {selectedPost.content}
              </Typography>
              <Box mt={2}>
                <Typography>
                  <strong>Likes:</strong> {selectedPost.likes || 0}
                </Typography>
                <Typography>
                  <strong>Comments:</strong> {selectedPost.comments || 0}
                </Typography>
                <Typography>
                  <strong>Shares:</strong> {selectedPost.shares || 0}
                </Typography>
                <Typography>
                  <strong>Impressions:</strong> {selectedPost.impressions || 0}
                </Typography>
                <Typography>
                  <strong>Engagement Rate:</strong>{' '}
                  {selectedPost.engagement_rate || 0}%
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalyticsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialMediaManagement;
