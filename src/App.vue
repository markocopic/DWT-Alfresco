<template>
  <v-app id="app">
    <!-- <transition name="nav-in" appear>
      <navbarApp/>
    </transition> -->
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
  components: {
    navbarApp: Navbar,
    bottomNavApp: BottomNav
  },
  mounted(){
    this.$router.push('/auth');
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
