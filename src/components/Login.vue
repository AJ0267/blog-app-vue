<template>
  <div class="hero bg-[#D5CEA3] min-h-screen">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="card bg-[#E5E5CB] w-full max-w-sm shrink-0 shadow-2xl">
        <form @submit.prevent="login" class="card-body">
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
            <label class="label">
              <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
            </label>
          </div>
          <div class="form-control mt-6">
            <button class="btn bg-[#1A120B] text-white text-lg hover:bg-[#1A120B]">Login</button>
          </div>
          <!-- <div class="form-control mt-2">
            <button
              type="button"
              @click="loginWithGoogle"
              class="btn btn-outline">Login with Google
            </button>
          </div> -->
          <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
          <p class="mt-4">
            <span>New here? </span>
            <router-link to="/register" class="link">Register</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', 
    };
  },
  methods: {
    async login() {
      this.errorMessage = ''; 
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/'); 
      } catch (error) {
       
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Incorrect password. Please try again.';
            break;
          default:
            this.errorMessage = 'Login failed: ' + error.message; 
            break;
        }
        console.error(error);
      }
    },
    async loginWithGoogle() {
      this.errorMessage = ''; 
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        this.$router.push('/'); 
      } catch (error) {
       
        this.errorMessage = 'Google login failed: ' + error.message;
        console.error(error);
      }
    },
  },
};
</script>

