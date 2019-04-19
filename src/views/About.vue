<template>
<div class="about mt-5" @click="closeDialog($event)">

  <v-layout row wrap>

    <v-flex xs12 md6 mt-5>
     
      <v-layout column fill-height mt-3>

        <v-flex xs6 ma-5 class="sidebar">

          <transition name="select" appear>
          <v-text-field class="tekst" box label="User status" dark v-model="status" @click="show=true; showStatus=false">{{ status }}
          </v-text-field>
          </transition>

          <transition name="dropdown">
          <div class="d" v-if="show">

            <p @click="choose(option)" v-for="(option, index) in options" :key="index" @mouseover="addClass(index)" @mouseleave="removeClass(index)" :id="'p'+index">
              {{ option }}
            </p>

          </div>
          </transition>


          <transition name="select2" appear>
          <v-text-field class="tekst" box label="User by status" dark @click="openList" @keyup="log" v-model="keyWord">
          </v-text-field>
          </transition>

          <p v-if="msg" style="color:red;">Please choose status first</p>

          <h2 style="color:white;">{{ name }}</h2>

          <transition name="dropdown">
          <div class="d" v-show="showStatus" id="scr">

            <p @click="getUser(option)" v-for="(option, index) in options2" :key="index" @mouseover="addClass(index)" @mouseleave="removeClass(index)" :id="'p'+index">
              {{ option }}
            </p>

          </div>
          </transition>

          

        </v-flex>

      </v-layout>

      <v-flex xs3 offset-xs8>

      </v-flex>

    </v-flex>

    <v-flex xs12 md6 mt-5 mb-5>

      <v-layout row wrap justify-center>

        <v-btn color="primary" @click="downloadPdf">Download</v-btn>

      </v-layout>

      <v-card color="primary" dark v-if="dialog" class="ma-5">

        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>

      </v-card>

      <transition name="component-fade" mode="out-in">
        <pdf v-show="image" class="pa-3 px-5 mx-5" :src="image"></pdf>
      </transition>

    </v-flex>
    

    <v-speed-dial
      v-model="fab"
      right
      transition="scale-transition"
      bottom
      fixed
      direction="left"
            >
          <v-btn slot="activator" fab flat small color="info">
              <v-icon>account_circle</v-icon>
              <v-icon>close</v-icon>
          </v-btn>
          <v-btn fab small flat color="info">
              <v-icon>search</v-icon>
          </v-btn>
          <v-btn fab small flat color="primary">
              <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab small flat color="error">
              <v-icon>delete</v-icon>
          </v-btn>
      </v-speed-dial>


  </v-layout>

</div>
</template>

<script>
import vuescroll from 'vue-scroll'
import FileSaver from 'file-saver'
import {saveAs} from 'file-saver'
import pdf from 'vue-pdf'
export default {
  components: {
    pdf,
    FileSaver
  },
  data() {
    return {
      fab: false,
      image: '',
      show: false,
      showStatus: false,
      hover: false,
      options: [],
      options2: [],
      keyWord: '',
      dialog: false,
      status: null,
      selectPage: 0,
      name: '',
      msg: false,
      endOfScroll: false
    }
  },
  mounted() {
    // ADDING SCROLL LISTENER FOR SELECT LIST
    let scr = document.getElementById('scr');
    scr.addEventListener('scroll', () => {
      this.onScroll(scr);
    });

    // SIMULATING DATA FETCH DELAY
    this.dialog = true;
    setTimeout(() => {
      this.getPdf();
    }, 2000);
    // GETTING DATA FOR SELECT LIST
    axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getData.js').
    then(response => {
      for (var i = 0; i < response.data.res2.length; i++) {
        this.options.push(response.data.res2[i].str_status);
      }
    })

  },
  methods: {
    // CHECKING IF CLICK EVENT IS INSIDE OF SELECT LIST,
    // IF NOT CLOSING ALL OPENED SELECT LISTS
    closeDialog(e) {
      if (e.target.type !== 'text') {
        if (this.show === true) this.status = null;
        if (this.showStatus === true) this.keyWord = '';
        this.show = false;
        this.showStatus = false;
      }
    },
    // DOWNLOAD PDF TO USERS FILE SYSTEM
    downloadPdf() {
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getBase64')
        .then(response => {
          FileSaver.saveAs(response.data.img, "invoice.pdf");
        })
        .catch(error => {
          console.log(error);
        });
    },
    // CHECKING IF SCROLL IS NEAR BOTTOM,
    // IF TRUE GETTING MORE DATA IF ANY
    onScroll(el) {
      if (el.scrollHeight - el.scrollTop <= 201 && this.endOfScroll === false) {
       this.infiniteScroll();
      }
    },
    // ADDING DYNAMIC CLASS TO HIGHLIGHT HOVERED ROW
    addClass(index) {
      document.getElementById(`p${index}`).style.backgroundColor = 'rgba(0,0,0,0.8)';
    },
    // ON BLUR REMOVE DYNAMIC CLASS
    removeClass(index) {
      document.getElementById(`p${index}`).style.backgroundColor = 'rgba(0,0,0,0.5)';
    },
    // GETTING DATA FOR DEPENDENT LIST AFTER CHOOSING STATUS
    choose(selected) {
      this.show = false;
      this.status = selected;
      this.options2 = [];
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getDependData.js', {
        params: {
          status: selected
        }
      }).then(response => {
        if (response.data.res.length < 20) this.endOfScroll = true;
        for (var i = 0; i < response.data.res.length; i++) {
          this.options2.push(response.data.res[i].str_ime);
        }
      })
    },
    // FETCHING SELECTED USER DATA FROM DEPENDENT LIST
    log() {
      this.options2 = [];
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/searchParam', {
        params: {
          status: this.status,
          keyWord: this.keyWord
        }
      }).then(response => {
        for (var i = 0; i < response.data.res.length; i++) {
          this.options2.push(response.data.res[i].str_ime);
        }
      })

    },
    // GETTING PDF FROM DB
    getPdf() {
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getBase64')
        .then(response => {
          this.dialog = false;
          this.image = response.data.img;
        })
    },
    // CHECKING IF USER STATUS IS SELECTED AND FETCHING DATA FOR DEPENDENT LIST
    openList() {
      if (this.status !== null) {
        this.dialog2 = true;
        this.endOfScroll = false;
        this.showStatus = !this.showStatus;
        this.show = false;
      } else {
        // ERROR MESSAGE IF NO STATUS
        this.msg = true;
        setTimeout(() => {
          this.msg = false
        }, 2000)
      }
    },
    // FETCHING MORE DATA FOR INFINITE SCROLL
    infiniteScroll() {
      this.selectPage += 1;
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getDependData.js', {
        params: {
          status: this.status,
          selectPage: this.selectPage,
          keyWord: this.keyWord
        }
      }).then(response => {
        for (var i = 0; i < response.data.res.length; i++) {
          this.options2.push(response.data.res[i].str_ime);
        }
      })
    },
    // TEST METHOD
    getUser(name) {
      console.log(name);
      this.showStatus = false;
      this.keyWord = '';
      this.name = name;
    }
  }
}
</script>

<style scoped>


.select-enter-active{
  animation: roll-up .8s;
}
.select2-enter-active{
  animation: roll-up 1.1s;
}
@keyframes roll-up{
  from{
    transform:translateY(500px);
  }
  to{
    transform: translateY(0);
  }
}


.dropdown-enter-active{
  -webkit-animation: scale-in-ver-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: scale-in-ver-top 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
            transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
  }
}
@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
            transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
  }
}


.tekst {
  padding: 0;
  margin: 0;
  border: 1px solid lightgrey;
  background-color: rgba(0, 0, 0, 0.5);
}

p {
  color: lightgrey;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  padding: 0px 10px;
  margin: 2px;
}

.d {
  background-color: rgba(0, 0, 0, 0.5);
  max-height: 200px;
  overflow: auto;
  border-radius: 6px;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .5s ease;
}

.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
