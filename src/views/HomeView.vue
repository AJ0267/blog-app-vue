<template>
  <div class="navbar bg-[#1A120B]">
    <div class="navbar-start">
      <a class="btn btn-ghost text-white text-2xl">BlogApp</a>
    </div>
    <div class="navbar-end">
      <router-link
        v-if="!user"
        to="/login"
        class="btn bg-white text-lg text-[#1A120B] rounded-none"
        >Login</router-link
      >
      <button
        v-if="user"
        @click="logout"
        class="btn bg-white text-lg btn-danger rounded-md"
      >
        Logout
      </button>
    </div>
  </div>

  <div
    class="hero min-h-screen bg-cover bg-center"
    style="background-image: url('/images/blog-app-hero.jpg')"
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-neutral-content text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl text-white font-bold">Welcome to BlogApp</h1>
        <p class="mb-5 text-white">
          Share your thoughts and discover engaging articles with our community!
        </p>
        <router-link
          to="/create-blog"
          class="btn text-white bg-[#1A120B] border-0 mr-2"
        >
          Create Blog
        </router-link>

        <router-link
          v-if="user"
          to="/my-blogs"
          class="btn text-white bg-[#1A120B] border-0"
        >
          My Blogs
        </router-link>
      </div>
    </div>
  </div>

  <div class="p-4 bg-[#D5CEA3]">
    <div v-if="user && userData" class="text-center">
      <p class="text-2xl">Hello, {{ userData.username }}!</p>
    </div>

    <div v-if="latestBlogs.length" class="mt-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Recent Blog Posts</h2>
      <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        <div
          v-for="(blog, index) in latestBlogs"
          :key="index"
          class="card shadow-lg bg-[#E5E5CB]"
        >
          <div class="card-body">
            <h3 class="card-title text-lg font-semibold">{{ blog.title }}</h3>
            <p class="card-text">{{ blog.content }}</p>
            <p class="text-sm text-gray-500">
              Posted by: {{ blog.authorName }}
            </p>
            <p class="text-sm text-gray-500">
              Created at: {{ formatDate(blog.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-4">
      <p class="text-lg text-gray-600">
        Please log in to check out blog posts or create your own!
      </p>
    </div>
  </div>

  <footer class="footer footer-center bg-[#1A120B] text-base-content p-4">
    <aside>
      <p class="text-white">
        Thank you for visiting BlogApp. Keep exploring and stay inspired!
      </p>
    </aside>
  </footer>
</template>

<script>
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";

export default {
  name: "HomeView",
  data() {
    return {
      user: null,
      userData: null,
      latestBlogs: [],
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.fetchUserData(user.uid);
      } else {
        this.user = null;
        this.userData = null;
      }
      this.fetchLatestBlog();
    });
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
        this.userData = null;
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    fetchUserData(uid) {
      const userRef = ref(database, `users/${uid}`);
      onValue(userRef, (snapshot) => {
        this.userData = snapshot.val();
      });
    },
    fetchLatestBlog() {
      const postsRef = ref(database, "posts");
      onValue(postsRef, (snapshot) => {
        const posts = snapshot.val();
        if (posts) {
          const postEntries = Object.entries(posts);

          postEntries.sort(
            (a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt)
          );

          const latestPosts = postEntries.slice(0, 3).map((entry) => entry[1]);

          this.latestBlogs = [];
          latestPosts.forEach((post) => {
            this.fetchAuthorName(post.authorId, post);
          });
        }
      });
    },
    fetchAuthorName(authorId, latestPost) {
      const authorRef = ref(database, `users/${authorId}`);
      onValue(authorRef, (snapshot) => {
        const authorData = snapshot.val();
        if (authorData) {
          latestPost.authorName = authorData.username;

          this.latestBlogs.push(latestPost);
        }
      });
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>
