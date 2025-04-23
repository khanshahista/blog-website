const blogContainer = document.getElementById('blog-container');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('readMoreModal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close-btn');

const apiKey = 'mdB4ZRIaDQOyc6i94qFTklD5MMTVZzZHVLjIvYHq4Hd3xlzFiVa0Ak86';

const blogPosts = [
  {
    "title": "Python",
    "snippet": "What is Python?",
    "keyword": "python Book",
    "details": "Python is a popular high-level programming language known for its simplicity and readability. It's widely used in areas like web development, data science, automation, and AI. Python has an easy-to-learn syntax, strong community support, and a large set of libraries that make it great for both beginners and professionals."
  },
  {
    "title": "Cloud Computing",
    "snippet": "What is Cloud computing?",
    "keyword": "Cloud Computing",
    "details": "Cloud Computing is the use of internet-based services to store, manage, and process data instead of using local servers or personal devices."
  },
  {
    "title": "Exploring Android OS",
    "snippet": "Android OS powers billions of devices worldwide.",
    "keyword": "android",
    "details": "Android is an open-source operating system developed by Google. It is the most widely used mobile OS, running on a variety of devices ranging from smartphones and tablets to smartwatches and TVs. Android offers a high degree of customization and flexibility, with an ecosystem that includes Google Play Store apps, and the ability to tweak system settings. The OS receives regular updates with new features, improved security, and performance enhancements."
  },
  {
    "title": "Operating System",
    "snippet": "What is Operating System.",
    "keyword": "Operating System",
    "details": "Cloud computing is the delivery of computing services like storage, servers, databases, networking, and software over the internet, allowing users to access and manage resources on-demand without owning physical hardware.."
  },
  {
    "title": "Operating System - Windows",
    "snippet": "Windows OS remains the go-to choice for business and gaming.",
    "keyword": "Microsoft Windows",
    "details": "Windows OS, developed by Microsoft, is one of the most widely used operating systems for both personal and professional computing. With each new release, Windows introduces features designed to improve user productivity, gaming experiences, and security. Windows 10 and Windows 11 have brought in a modernized user interface, improved multitasking, better integration with cloud services, and the introduction of virtual desktops."
  },
  {
    "title": "Linux: The Open-Source Revolution",
    "snippet": "Linux is a robust and flexible OS used in servers, desktops, and more.",
    "keyword": "kali linux",
    "details": "Linux is an open-source operating system kernel that serves as the foundation for a variety of distributions (distros) like Ubuntu, CentOS, and Debian. It is widely used in server environments, but has also gained traction as a desktop OS due to its stability, security, and flexibility. The Linux community contributes to constant improvements, and the OS is ideal for developers, security professionals, and those seeking customization."
  },
  {
    "title": "The Impact of Artificial Intelligence",
    "snippet": "AI is shaping industries and transforming the way we live and work.",
    "keyword": "coding",
    "details": "Artificial intelligence (AI) is the simulation of human intelligence processes by machines. It includes technologies like machine learning, natural language processing, and robotics, which are being applied in industries ranging from healthcare to finance. AI can help automate repetitive tasks, provide insights from vast data sets, and even enhance customer experiences with personalized recommendations. AI is also playing a crucial role in creating smarter products and services."
  },
  {
    "title": "AI and Machine Learning: A New Era",
    "snippet": "Machine learning is driving the next generation of AI technology.",
    "keyword": "machine learning",
    "details": "Machine learning (ML) is a subset of artificial intelligence that focuses on building algorithms that allow computers to learn from data. ML enables systems to improve their performance without explicit programming. In recent years, advancements in deep learning and neural networks have taken machine learning to new heights, contributing to breakthroughs in image recognition, natural language processing, and autonomous vehicles. ML is revolutionizing industries such as healthcare, marketing, and finance."
  },
  {
    "title": "Blockchain: The Future of Data Security",
    "snippet": "Blockchain technology is providing new ways to ensure data integrity and security.",
    "keyword": "blockchain",
    "details": "Blockchain is a decentralized digital ledger technology that ensures data is securely stored and verified. It enables secure, transparent, and tamper-resistant transactions, which has made it popular in the world of cryptocurrencies. Beyond digital currencies like Bitcoin, blockchain has applications in supply chain management, healthcare, voting systems, and intellectual property protection. The decentralized nature of blockchain reduces the risk of fraud and increases trust in various industries."
  },
  {
    "title": "YOGA",
    "snippet": "What is the benefit of yoga?",
    "keyword": "yoga",
    "details": "Yoga improves flexibility, strength, and posture, reduces stress, boosts mental clarity, and promotes overall physical and emotional well-being. "
  },
  {
    "title": "Cryptocurrency: Revolutionizing Finance",
    "snippet": "Cryptocurrency is changing the way we think about money and finance.",
    "keyword": "cryptocurrency",
    "details": "Cryptocurrency is a form of digital or virtual currency that relies on cryptography for security. It operates independently of central banks, making it a decentralized form of currency. Bitcoin, Ethereum, and other cryptocurrencies have gained popularity for their potential to offer lower transaction fees and faster transfers compared to traditional banking systems. Cryptocurrencies are also seen as an investment opportunity, with the potential for significant returns, but they come with high volatility and risks."
  }
];

function initBlog() {
  showLoading();
  
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

  Promise.all(imageFetchPromises)
    .then(postsWithImages => {
      renderPosts(postsWithImages);
      hideLoading();
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      hideLoading();
    });
}

function renderPosts(posts) {
  blogContainer.innerHTML = '';
  
  posts.forEach((post, index) => {
    const blogPost = document.createElement('div');
    blogPost.className = 'post reveal';
    blogPost.innerHTML = `
      <img src="${post.imageUrl}" alt="${post.keyword}">
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
