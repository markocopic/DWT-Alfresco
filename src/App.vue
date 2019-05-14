<template>
  <v-app id="app">
    <v-snackbar v-model="invite" top class="white--text" color="red" multi-line>
      {{ msg }}
      <v-btn color="yellow" @click="goTo(lastInvitation)">go to chat</v-btn>
      <v-btn color="yellow" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>

<v-btn color="red" dark small @click="showInvitations" v-if="counter>0" style="width:60px;">
    <v-icon style="cursor:pointer;">mail</v-icon>
      {{counter}}
</v-btn>

    <v-dialog v-model="allInvites" max-width="50vw">
      <v-layout row wrap>
        <v-flex>
          <div style="background:white;padding:10px;text-align:center;" v-for="(invite,i) in invitations" :key="i">
            <strong>{{invite.host}}</strong> invited you to join chat channel: <strong>{{invite.channel}}</strong>
          <v-btn dark color="red" @click="goTo(invite.channel)">go to chat</v-btn>
          </div>
        </v-flex>
      </v-layout>

     </v-dialog>



    <transition name="page-out" mode="out-in">
      <router-view></router-view>
    </transition>
    <bottomNavApp/> 
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'
import BottomNav from './components/BottomNav.vue'

export default {
  name: 'App',
  data(){
    return{
      invite:false,
      msg:'',
      counter:0,
      invitations:[],
      lastInvitation:'',
      allInvites:false
    }
  },
  components: {
    navbarApp: Navbar,
    bottomNavApp: BottomNav
  },
  mounted(){
    let self = this;
    this.$router.push('/auth');

    socket.on('invite', function(person){
      console.log(person);
      
      if(sessionStorage.getItem('name') == person.name && self.lastInvitation != person.channel){
        
        self.invite = true;
        self.msg = person.host + ' invited you to join chat channel: '+person.channel;
        self.invitations.push(person);
        self.lastInvitation = person.channel;
        self.counter+=1;
        
      }
      
    })
  },
  methods:{
    showInvitations(){
      this.allInvites = true;
    },
    goTo(channel){
      this.invite = false;
      this.allInvites = false;
      this.$router.push('/barcode');
      this.$router.push('/chat/'+channel);
      this.$store.state.bottomNav = 4;
      this.counter -= 1;
      for (let i = 0; i < this.invitations.length; i++) {
        if(this.invitations[i].channel == channel)
          this.invitations.splice(i,1);
      }
      if(this.invitations.length < 1)
        this.lastInvitation = '';
    }
  }
}
</script>

<style scoped>
.page-out-leave-active{
  animation: fade-out .5s ease-out;
}
.page-out-enter-active{
  animation: fade-in .5s ease-in;
}
.nav-in-enter-active{
  animation: slide-top 1s ease-out;
}
@keyframes fade-out{
  from{
    opacity: 1;
  }
  to{
    opacity: 0;
  }
}
@keyframes fade-in{
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}
@keyframes slide-top{
  from{
    transform: translateY(-50px);
  }
  to{
    transform: translateY(0);
  }
}

  #app{
    /* background-image:url('./assets/bgImage.png');
    background-size: cover; */

    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#0e0e0e+-1,7d7e7d+0,0e0e0e+0,2b2b2b+19,7d7e7d+51,0e0e0e+93 */
background: rgb(14,14,14); /* Old browsers */
background: -moz-linear-gradient(-45deg, rgba(14,14,14,1) -1%, rgba(125,126,125,1) 0%, rgba(14,14,14,1) 0%, rgba(43,43,43,1) 19%, rgba(125,126,125,1) 51%, rgba(14,14,14,1) 93%); /* FF3.6-15 */
background: -webkit-linear-gradient(-45deg, rgba(14,14,14,1) -1%,rgba(125,126,125,1) 0%,rgba(14,14,14,1) 0%,rgba(43,43,43,1) 19%,rgba(125,126,125,1) 51%,rgba(14,14,14,1) 93%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(135deg, rgba(14,14,14,1) -1%,rgba(125,126,125,1) 0%,rgba(14,14,14,1) 0%,rgba(43,43,43,1) 19%,rgba(125,126,125,1) 51%,rgba(14,14,14,1) 93%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0e0e0e', endColorstr='#0e0e0e',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
 }


</style>
