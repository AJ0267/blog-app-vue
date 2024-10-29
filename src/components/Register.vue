<template>
  <div class="hero bg-[#D5CEA3] min-h-screen">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="card bg-[#E5E5CB] w-full max-w-sm shrink-0 shadow-2xl">
        <form @submit.prevent="register" class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input
              type="text"
              v-model="username"
              placeholder="username"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              v-model="email"
              placeholder="email"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              v-model="password"
              placeholder="password"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control mt-6">
            <button
              class="btn bg-[#1A120B] text-white text-lg hover:bg-[#1A120B]"
            >
              Register
            </button>
          </div>
          <div class="form-control mt-2">
            <button type="button" @click="goToLogin" class="btn btn-outline">
              Already have an account? Login
            </button>
          </div>
        </form>

        <div v-if="showConfirmation" class="alert bg-[#1A120B] text-white mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Registration successful!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { database } from "../firebaseConfig";

export default {
  data() {
    return {
      email: "",
      password: "",
      username: "",
      showConfirmation: false,
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        await set(ref(database, "users/" + user.uid), {
          email: user.email,
          username: this.username,
        });

        this.showConfirmation = true;
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed: " + error.message);
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
