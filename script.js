const blogContainer = document.getElementById('blog-container');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('readMoreModal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close-btn');

const apiKey = 'mdB4ZRIaDQOyc6i94qFTklD5MMTVZzZHVLjIvYHq4Hd3xlzFiVa0Ak86';

// Load posts from JSON instead of hardcoded array
let blogPosts = [];

function initBlog() {
  showLoading();
  
  // First fetch the posts data from JSON
  fetch('data/posts.json')
    .then(response => response.json())
    .then(data => {
      blogPosts = data.posts;
      
      // Then fetch images for each post
      const imageFetchPromises = blogPosts.map(post => {
        return fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(post.keyword)}&per_page=1`, {
          headers: {
            Authorization: apiKey
          }
        })
        .then(response => response.json())
        .then(data => {
          return {
            ...post,
            imageUrl: data.photos.length > 0 ? data.photos[0].src.medium : 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
          };
        })
        .catch(error => {
          console.error('Error fetching image for', post.keyword, error);
          return {
            ...post,
            imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
          };
        });
      });

      return Promise.all(imageFetchPromises);
    })
    .then(postsWithImages => {
      renderPosts(postsWithImages);
      hideLoading();
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      hideLoading();
      
      // Fallback to hardcoded posts if JSON fails
      const fallbackPosts = [/* your original hardcoded posts array */];
      blogPosts = fallbackPosts;
      const fallbackImages = fallbackPosts.map(post => ({
        ...post,
        imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
      }));
      renderPosts(fallbackImages);
    });
}

function renderPosts(posts) {
  blogContainer.innerHTML = '';
  
  posts.forEach((post, index) => {
    const blogPost = document.createElement('div');
    blogPost.className = 'post reveal';
    blogPost.style.animationDelay = `${index * 0.1}s`; // Staggered animation
    blogPost.innerHTML = `
      <img src="${post.imageUrl}" alt="${post.keyword}" class="post-image">
      <h3 class="post-title">${post.title}</h3>
      <p class="post-snippet">${post.snippet}</p>
      <a href="#" class="read-more" onclick="openModal('${post.title.replace(/'/g, "\\'")}', '${post.details.replace(/'/g, "\\'")}'); return false;">Read More</a>
    `;
    blogContainer.appendChild(blogPost);
  });
  
  revealOnScroll();
}

function showLoading() {
  const loading = document.createElement('div');
  loading.className = 'loading-spinner';
  blogContainer.appendChild(loading);
}

function hideLoading() {
  const loading = document.querySelector('.loading-spinner');
  if (loading) loading.remove();
}

function openModal(title, content) {
  modalTitle.textContent = title;
  modalDetails.textContent = content;
  
  modal.style.display = 'flex';
  document.querySelector('.modal-content').style.animation = 'none';
  setTimeout(() => {
    document.querySelector('.modal-content').style.animation = 'modalFadeIn 0.3s ease-out forwards';
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

function searchPosts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) || 
    post.snippet.toLowerCase().includes(searchTerm) ||
    post.details.toLowerCase().includes(searchTerm)
  );
  
  showLoading();
  const imageFetchPromises = filteredPosts.map(post => {
    return fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(post.keyword)}&per_page=1`, {
      headers: {
        Authorization: apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      return {
        ...post,
        imageUrl: data.photos.length > 0 ? data.photos[0].src.medium : 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
      };
    })
    .catch(error => {
      console.error('Error fetching image for', post.keyword, error);
      return {
        ...post,
        imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
      };
    });
  });

  Promise.all(imageFetchPromises)
    .then(postsWithImages => {
      renderPosts(postsWithImages);
      hideLoading();
    })
    .catch(error => {
      console.error('Error loading filtered posts:', error);
      hideLoading();
    });
}

function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const revealPoint = 150;
  
  reveals.forEach(reveal => {
    const revealTop = reveal.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      reveal.classList.add('active');
    }
  });
}

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const navbar = document.querySelector('.navbar');
  
  if (currentScroll <= 10) {
    navbar.style.transform = 'translateY(0)';
  } else if (currentScroll > lastScroll && currentScroll > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;
  
  revealOnScroll();
});

document.addEventListener('DOMContentLoaded', () => {
  initBlog();
  window.addEventListener('scroll', revealOnScroll);
});

searchInput.addEventListener('input', searchPosts);

// === Animated Comment Section ===
document.addEventListener('DOMContentLoaded', () => {
  loadComments();
  revealOnScroll();
});

function addComment() {
  const input = document.getElementById("commentInput");
  const comment = input.value.trim();
  if (comment === "") return;

  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.push(comment);
  localStorage.setItem("comments", JSON.stringify(comments));

  input.value = "";
  loadComments();
}

function loadComments() {
  const commentsList = document.getElementById("commentsList");
  const comments = JSON.parse(localStorage.getItem("comments")) || [];

  commentsList.innerHTML = comments
    .map((c, i) => `
      <div class="comment-item reveal" style="animation-delay:${i * 0.1}s">
        <strong>User ${i + 1}:</strong> ${c}
      </div>
    `)
    .join("");

  revealOnScroll();
}
