<template>
  <div class="bg-[#D5CEA3] min-h-screen">
    <div class="navbar bg-[#1A120B]">
      <div class="navbar-start">
        <router-link to="/" class="btn btn-ghost text-white text-2xl">Home</router-link>
      </div>
      <div class="navbar-end">
        <button
          v-if="user"
          @click="logout"
          class="btn bg-white text-lg btn-danger rounded-md"
        >
          Logout
        </button>
      </div>
    </div>

    <div class="p-4">
      <div class="card bg-[#E5E5CB] shadow-lg mb-4 w-11/12 sm:w-1/3 mx-auto">
        <div class="card-body">
          <h3 class="card-title text-lg font-semibold">User Details</h3>
          <p class="text-sm">Email: {{ user.email }}</p>
          <p class="text-sm">Username: {{ username }}</p>
          <p class="text-sm">Blog Count: {{ userBlogs.length }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <router-link
        to="/create-blog"
        class="btn btn-primary text-white bg-[#1A120B] hover:bg-[#333333] text-lg rounded-md"
      >
        Create Blog
      </router-link>
    </div>

    <div class="p-4">
      <h2 v-if="userBlogs.length" class="text-2xl font-bold mb-4">Your Blog Posts</h2>

      <div v-if="userBlogs.length" class="grid grid-cols-1 gap-4">
        <div
          v-for="(blog, index) in userBlogs"
          :key="index"
          class="card bg-[#E5E5CB] shadow-lg w-full"
        >
          <div class="card-body">
            <h3 class="card-title text-lg font-semibold">{{ blog.title }}</h3>
            <p class="card-text">{{ blog.content }}</p>
            <p class="text-sm text-gray-500">
              Posted on: {{ formatDate(blog.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-4">
        <p class="text-lg text-gray-600">You have not created any blog posts yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; 
import { database } from "../firebaseConfig";
import { ref as dbRef, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

export default {
  name: "UserBlogs",
  setup() {
    const userBlogs = ref([]);
    const username = ref("");
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();  

    const fetchUserBlogs = () => {
      if (user) {
        const postsRef = dbRef(database, "posts");
        onValue(postsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            userBlogs.value = Object.values(data)
              .filter(blog => blog.authorId === user.uid)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else {
            userBlogs.value = [];
          }
        });
      }
    };

    const fetchUserDetails = () => {
      if (user) {
        const userProfileRef = dbRef(database, `users/${user.uid}`);
        onValue(userProfileRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.username) {
            username.value = data.username;
          }
        });
      }
    };

    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    };

    const logout = async () => {
      await auth.signOut();
      router.push("/");  
    };

    onMounted(() => {
      fetchUserBlogs();
      fetchUserDetails();
    });

    return {
      userBlogs,
      username,
      formatDate,
      logout,
      user,
    };
  },
};
</script>
