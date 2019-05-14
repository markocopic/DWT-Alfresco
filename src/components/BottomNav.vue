<template>
    <v-bottom-nav
      :active.sync="$store.state.bottomNav"
      :color="color"
      :value="true"
      absolute
      dark
    >
      <v-btn dark @click="signOut">
        <span v-if="!$store.state.logged">Sign in</span>
        <span v-if="$store.state.logged">Sign out</span>
        <v-icon v-if="!$store.state.logged">lock_open</v-icon>
        <v-icon v-if="$store.state.logged">lock</v-icon>
      </v-btn>

      <v-btn dark :disabled="!$store.state.logged">
        <span>Barcode reader</span>
        <v-icon>view_column</v-icon>
      </v-btn>

      <v-btn dark :disabled="!$store.state.logged">
        <span>Search</span>
        <v-icon>find_in_page</v-icon>
      </v-btn>

      <v-btn dark :disabled="!$store.state.logged">
        <span>Scanner</span>
        <v-icon>scanner</v-icon>
      </v-btn>

      <v-btn dark :disabled="!$store.state.logged">
        <span>Chat</span>
        <v-icon>chat</v-icon>
      </v-btn>

    </v-bottom-nav>
</template>

<script>
  export default {
    data(){
      return {
        show:false
      }
    },
    methods:{
        signOut(){
            sessionStorage.removeItem('id');
            this.$store.state.logged = false;
            this.$router.push('/auth');
        }
    },
    computed:{
      color () {
        if(this.$store.state.logged == false)
              this.$store.state.bottomNav = 0;
        switch (this.$store.state.bottomNav) {
          case 0: 
            return 'primary'
          case 1: 
            this.$router.push('/barcode');
            return 'blue-grey'
          case 2: 
            this.$router.push('/search');
            return 'indigo'
          case 3: 
            this.$router.push('/scanner');
            return 'teal'
          case 4: 
            //this.$router.push('/chat/edcbd181-a2a7-4d2c-993e-d53d3be39b9a92');
            return 'success'
        }
      }
    }
  }
</script>

<style scoped>
</style>
