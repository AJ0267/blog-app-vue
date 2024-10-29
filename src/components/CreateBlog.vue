<template>
  <div class="hero bg-[#D5CEA3] min-h-screen">
    <div class="hero-content flex-col">
      <div class="card bg-[#E5E5CB] w-full max-w-sm shrink-0 shadow-2xl">
        <form @submit.prevent="createPost" class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Title</span>
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="Post Title"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Content</span>
            </label>
            <textarea
              v-model="content"
              placeholder="Post Content"
              class="textarea textarea-bordered"
              required
            ></textarea>
          </div>
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn bg-[#1A120B] text-white text-lg hover:bg-[#1A120B]"
            >
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "../firebaseConfig"; 
import { ref, push, set } from "firebase/database"; 
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    async createPost() {
      const postRef = ref(database, "posts"); 
      const newPostRef = push(postRef); 

      try {
        const user = getAuth().currentUser;
        
        await set(newPostRef, {
          title: this.title,
          content: this.content,
          authorId: user ? user.uid : "anonymous", 
          createdAt: new Date().toISOString(),
        });

        this.title = "";
        this.content = "";
        // alert("Post created successfully!");
        this.$router.push("/my-blogs");
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post: " + error.message);
      }
    },
  },
};
</script>

