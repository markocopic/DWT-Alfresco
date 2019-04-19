<template>
  <div class="auth">
      <v-container fluid fill-height>

          <v-snackbar
              v-model="err"
              top
              class="white--text"
              color="blue-grey"
              multi-line
            >
              Invalid username or password
              <v-btn
                color="yellow"
                flat
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </v-snackbar>

        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mb-5">
              <v-toolbar dark color="primary" flat>
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field @keyup.enter="login" v-model="username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field @keyup.enter="login" v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        username: "",
        password: "",
        err: false
      }
    },
    mounted(){

      // axios.post('https://cors-anywhere.herokuapp.com/http://35.204.234.73/alfresco/api/-default-/public/search/versions/1/search',
      //     {
      //        "query":{
      //            //"query":"ASPECT:'csm:NoviPodatak'"
      //            "query":"csm:metapodatak:*"
      //        },
      //         include: ["properties","aspectNames"]
      //     },
      //     {
      //         headers:{
      //                Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
      //            }
      //     }).then(response =>{
      //       console.log(response);
      //     })

      axios.get('https://cors-anywhere.herokuapp.com/http://35.204.234.73/alfresco/api/-default-/public/authentication/versions/1/tickets/-me-',{
            headers:{
                     Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
                 }
          }).then(response =>{
            this.$store.state.logged = true;
            this.$store.state.bottomNav = 1;
          }).catch(error =>{
            console.log(error);
          })
    },
    methods: {
      login(){
          axios.post('https://cors-anywhere.herokuapp.com/http://35.204.234.73/alfresco/api/-default-/public/authentication/versions/1/tickets',{
              "userId":this.username,
              "password":this.password
          }).then(response =>{
            sessionStorage.setItem('id',response.data.entry.id);
            this.$store.state.logged = true;
            this.$store.state.bottomNav = 1;
          }).catch(error =>{
            this.err = true;
          })
      }
    }
  }
</script>

<style>
.auth{
    height:100%;
}
</style>
