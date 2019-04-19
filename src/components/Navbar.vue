<template>
  <div class="nav">
<!-- NAVIGATION DRAWER START -->
    <v-navigation-drawer dark v-model="drawer" app temporary>
      <v-toolbar flat>
        <v-list>
          <v-list-tile ripple>
            <v-list-tile-title class="">
              <span class="white primary--text pl-1">fadata</span>
              <span class="font-weight-light white black--text pr-1">-pilot</span>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0">
        <v-list-tile
        ripple
          v-for="menuItem in menuItems"
          :key="menuItem.title"
          router
          :to="menuItem.link"
        >

          <v-list-tile-content>
            <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
<!-- NAVIGATION DRAWER END -->

<!-- NAVBAR START -->

  <!-- NAVBAR FOR USERS THAT HAVEN'T LOGGED YET -->
  <v-toolbar app dark flat v-if="!logged" height="50" color="rgba(0,0,0,0.3)">
    <v-toolbar-side-icon class="hidden-sm-and-up hidden-xs-only" @click="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link :to="getLink" tag="span" style="cursor:pointer;">
        <span class="white primary--text pl-1">fadata</span>
        <span class="font-weight-light white black--text pr-1">-pilot</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- HIDDEN ON SMALLER SCREENS -->
    <div class="hidden-sm-and-down">
      <input v-focus class="black--text" type="text" placeholder="Username" v-model="username"
      @keyup="checkbtn"/>
      <input class="black--text" type="password" placeholder="Password" v-model="password"
       @keyup="checkbtn"/>
       <v-spacer class="hidden-md-and-up"></v-spacer>
         <v-btn
           flat
           @click="login"
         >
           <span class="mr-2 hidden-xs-only">Login</span>
           <v-icon>check</v-icon>
         </v-btn>
         
       </div>
  </v-toolbar>

  <!-- ONLY VISIBLE ON SMALLER SCREENS -->
<v-container v-if="!logged" text-xs-center>
  <v-layout row wrap class="hidden-md-and-up mt-5" justify-center>
    <v-flex xs4 justify-space-around class="text-xs-center">
        <v-text-field
          v-model="username"
          dark
          name="user"
          label="Username"
          single-line
          prepend-icon="person"
          @keyup="checkbtn"
        ></v-text-field>

        <v-text-field
          v-model="password"
          dark
          name="pass"
          label="Password"
          single-line
          prepend-icon="lock"
          type="password"
          @keyup="checkbtn"
        ></v-text-field>

         <v-btn
           @click="login"
           class="d-inline-block ma-2"
         >
           <span class="mr-2 hidden-xs-only">Login</span>
           <v-icon>check</v-icon>
         </v-btn>
         <v-btn class="ma-2">
           <span class="mr-2 hidden-xs-only">Register</span>
           <v-icon>launch</v-icon>
         </v-btn>
         

    </v-flex>
  </v-layout>
  </v-container>

<!-- THIS NAVBAR IS VISIBLE WHEN USER IS LOGGED -->
  <v-toolbar dark flat app v-if="logged" height="50" color="rgba(0,0,0,0.3)">
    <v-toolbar-side-icon class="hidden-sm-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>
      <router-link :to="getLink" tag="span" style="cursor:pointer;">
        <span class="white primary--text pl-1">fadata</span>
        <span class="font-weight-light white black--text pr-1">-pilot</span>
      </router-link>
    </v-toolbar-title>

<!-- SMALL FLAGS FOR CHANGING COLOR THEME -->
    <v-icon color="blue" style="cursor:pointer;" @click="changeTheme('blue')">bookmark</v-icon>
    <v-icon color="green" style="cursor:pointer;" @click="changeTheme('green')">bookmark</v-icon>
    <v-icon color="purple" style="cursor:pointer;" @click="changeTheme('purple')">bookmark</v-icon>
    <v-icon color="grey" style="cursor:pointer;" @click="changeTheme('grey')">bookmark</v-icon>

    <v-spacer></v-spacer>
    <v-toolbar-title class="mr-1 hidden-sm-and-down">{{ username }}</v-toolbar-title>
    <v-icon>person</v-icon>
    <v-btn
      flat
      @click="logout"
    >
      <span class="mr-2 hidden-xs-only">Logout</span>
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </v-toolbar>
  <v-toolbar app class="hidden-xs-only px-3 mt-5" flat height="30" v-if="logged" color="rgba(0,0,0,0)">
    <v-toolbar-items class="caption" v-for="menuItem in menuItems" :key="menuItem.title">
      <!-- DROPDOWN SUBMENU -->
      <v-menu offset-y v-if="menuItem.title=='userMenu3'">
        <v-btn small
        class="text-capitalize"
        color="info"
        dark slot="activator">{{ menuItem.title }}</v-btn>
        <v-list class="primary" dark >
          <v-list-tile>
            <v-list-tile-title class="caption text-capitalize">submenu1</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="caption text-capitalize">submenu2</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title class="caption text-capitalize">submenu3</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn v-if="menuItem.title!='userMenu3'"
        class="text-capitalize"
        color="info"
        small
        router
        :to="menuItem.link"
      >{{ menuItem.title }}</v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>
  </v-toolbar>
  <!-- NAVBAR END -->

  <!-- MESSAGE FOR INVALID CREDENTIALS -->
  <div v-show="msgShow" class="msg text-xs-center">
      <h2>{{ message }}</h2>
  </div>
  

</div>
</template>

<script>
import pdf from 'vue-pdf'
  export default {
    components: {
    pdf
  },
    mounted() {
      
    },
    data(){
      return {
        image: '',
        menuItems: [],
        logged: false,
        username: '',
        password: '',
        message: '',
        msgShow: false,
        drawer: false,
        imgData: '',
        scan: false,
        editor: false,
        DWObject: null
      }
    },
    computed:{
      // IF USER IS ALREADY LOGGED IN, ROUTING TO HOMEPAGE
      // IF NOT ROUTING TO LOGIN PAGE
      getLink(){
        if(this.menuItems[0]!=undefined){
          return this.menuItems[0].link;
        }else{
          return '/';
        }
      },
      
    },
    methods:{
      // CHANGE APP COLOR THEME
      changeTheme(color){
        switch(color){
          case 'green':
            this.$vuetify.theme.primary = '#2E7D32';
            this.$vuetify.theme.info = '#4CAF50';
            this.$vuetify.theme.error = this.$vuetify.theme.warning;
          break;
          case 'blue':
            this.$vuetify.theme.primary = '#0277BD';
            this.$vuetify.theme.info = '#00aeef';
            this.$vuetify.theme.error = '#ff4444';
          break;
          case 'purple':
            this.$vuetify.theme.primary = '#6A1B9A';
            this.$vuetify.theme.info = '#9C27B0';
            this.$vuetify.theme.error = this.$vuetify.theme.accent;
          break;
          case 'grey':
            this.$vuetify.theme.primary = '#37474F';
            this.$vuetify.theme.info = '#607D8B';
            this.$vuetify.theme.error = this.$vuetify.theme.secondary;
          break;
        }

      },
      // CHECKING IF USER HAS PRESSED ENTER AND TRYING TO LOG IN
      checkbtn(event){
          if(event.key=='Enter')
          this.login();
      },
      // IF LOGIN IS SUCCESSFULL, GETTING MENU ITEMS AND ROUTING TO HOMEPAGE
      login(){
        axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/login.js',
        { params:{
          username:this.username,
          password:this.password
        }
      }).then(response=>{
        if(response.data.status=='ok'){
          this.menuItems=response.data.res;
          this.logged=true;
          this.$store.state.logged=true;
          this.$router.push(response.data.res[0].link);
        }else{
          this.message='Invalid credentials';
          this.msgShow=true;
          setTimeout(()=>{ this.msgShow=false; }, 3000);
        }
      })
    },
    logout(){
      this.logged=false;
      this.$store.state.logged=false;
      this.username='';
      this.password='';
      this.$router.push('/');
    }
    }
  }
</script>

<style scoped>
  input{
    background-color: white;
    border: 1px solid black;
    margin: 10px;
    padding-left: 5px;
  }
  .msg{
    height: 32px;
    background-color: rgb(0, 0, 0,0.7);
    color: yellow;
  }
</style>
