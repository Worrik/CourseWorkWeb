<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" lg="4">
          <v-card color="navbar" elevation="0">
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-alert
                  v-if="error"
                  color="secondary"
                  dense
                  type="error"
                >{{ error }}</v-alert>
                <v-text-field
					autofocus
					v-model="username" 
					label="Enter your name" 
					name="username" 
					prepend-inner-icon="mdi-email" 
					class="rounded-0" 
					outlined>
				</v-text-field>
                <v-text-field 
					v-model="password" 
					label="Enter your password" 
					name="password" 
					prepend-inner-icon="mdi-lock" 
					type="password" 
					class="rounded-0" 
					outlined>
				</v-text-field>
                <v-btn type="submit" color="secondary" x-large block>Login</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Vue from "vue";

export default {
  name: "Login",
  data(){
    return {
      username : "",
      password : "",
      error: ""
    }
  },
  methods: {
    login() {
      let username = this.username
      let password = this.password
      this.$http.post(`${this.$hostname}/token/`, `username=${username}&password=${password}`)
          .then((response) => {
            if (response.data.access_token) {
              Vue.prototype.$http.defaults.headers.common['Authorization'] = `bearer ${response.data.access_token}`
              this.$router.push('/dashboard')
              localStorage.setItem('token', `bearer ${response.data.access_token}`)
            }
          })
          .catch(() => {
              this.error = "Incorrect name or password"
          })
    }
  }
}
</script>

<style scoped>

</style>
