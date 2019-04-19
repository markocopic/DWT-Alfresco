<template>
  <v-container text-xs-center fluid fill-height>
    <v-layout column wrap align-center justify-center>
      <v-flex xs10 sm8 lg6>


        <transition appear>
          <img src="@/assets/test5.png" alt="Document picture">
        </transition>
      </v-flex>
    </v-layout>


  </v-container>
</template>

<script>
export default {

}
</script>

<style scoped>


.v-enter-active {
  -webkit-animation: rotate-in-diag-2 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: rotate-in-diag-2 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}


@-webkit-keyframes rotate-in-diag-2 {
  0% {
    -webkit-transform: rotate3d(-1, 1, 0, -360deg);
            transform: rotate3d(-1, 1, 0, -360deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate3d(-1, 1, 0, 0deg);
            transform: rotate3d(-1, 1, 0, 0deg);
    opacity: 1;
  }
}
@keyframes rotate-in-diag-2 {
  0% {
    -webkit-transform: rotate3d(-1, 1, 0, -360deg);
            transform: rotate3d(-1, 1, 0, -360deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate3d(-1, 1, 0, 0deg);
            transform: rotate3d(-1, 1, 0, 0deg);
    opacity: 1;
  }
}




</style>
