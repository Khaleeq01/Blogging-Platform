import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import axios from 'axios';
import './App.css'; // Import CSS file

const apiUrl = 'http://localhost:4000';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editPost, setEditPost] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editPost) {
      setEditPost(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setNewPost(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddPost = () => {
    axios.post(`${apiUrl}/posts`, newPost)
      .then(response => {
        setPosts(prevState => [...prevState, response.data]);
        setNewPost({ title: '', content: '' });
      })
      .catch(error => {
        console.error('Error adding post:', error);
      });
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setOpen(true);
  };

  const handleUpdatePost = () => {
    axios.put(`${apiUrl}/posts/${editPost._id}`, editPost)
      .then(response => {
        setPosts(prevState => prevState.map(post => post._id === editPost._id ? response.data : post));
        setEditPost(null);
        setOpen(false);
      })
      .catch(error => {
        console.error('Error updating post:', error);
      });
  };

  const handleDeletePost = (id) => {
    axios.delete(`${apiUrl}/posts/${id}`)
      .then(() => {
        setPosts(prevState => prevState.filter(post => post._id !== id));
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  const handleClose = () => {
    setEditPost(null);
    setOpen(false);
  };

  return (
    <div className="app">
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Typography variant="h6">My Blog</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="container">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="card">
              <CardContent className="card-content">
                <TextField
                  label="Title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Content"
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  multiline
                  fullWidth
                  margin="normal"
                />
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className="add-post-button"
                onClick={handleAddPost}
              >
                Add Post
              </Button>
            </Card>
          </Grid>
          {posts.map(post => (
            <Grid key={post._id} item xs={12} sm={6} md={4}>
              <Card className="card">
                <CardContent className="card-content">
                  <Typography variant="h5" className="post-title">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" className="post-content">
                    {post.content}
                  </Typography>
                </CardContent>
                <div className="card-actions">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditPost(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={editPost ? editPost.title : ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Content"
              name="content"
              value={editPost ? editPost.content : ''}
              onChange={handleInputChange}
              multiline
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdatePost} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default App;
