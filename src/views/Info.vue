<template>
<div class="main mt-5" align-content-center>

  <v-layout justify-center row wrap class="pt-2 mt-5">
    <transition name="side" appear>
<!-- SIDEBAR MENU WITH SEARCH FILTERS -->
    <v-flex xs10 sm6 md2 order-lg2 class="sidebar pa-3 mt-1 text-sm-center">
      <v-btn :loading="loading" color="primary" @click="startSearch">Start search</v-btn>
      <v-form ref="form">
      <!-- DATE PICKER 1 -->
      <v-menu
       ref="menu"
       :close-on-content-click="false"
       v-model="menu"
       :nudge-right="40"
       :return-value.sync="date"
       lazy
       transition="scale-transition"
       offset-y
       full-width
       min-width="290px"
     >
       <v-text-field
         slot="activator"
         v-model="date"
         label="Start date:"
         prepend-icon="event"
       ></v-text-field>
       <v-date-picker v-model="date" no-title scrollable>
         <v-spacer></v-spacer>
         <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
         <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
       </v-date-picker>
     </v-menu>
      <!-- DATE PICKER 2 -->
      <v-menu
       ref="menu2"
       :close-on-content-click="false"
       v-model="menu2"
       :nudge-right="40"
       :return-value.sync="date2"
       lazy
       transition="scale-transition"
       offset-y
       full-width
       min-width="290px"
     >
       <v-text-field
         slot="activator"
         v-model="date2"
         label="End date:"
         prepend-icon="event"
       ></v-text-field>
       <v-date-picker v-model="date2" no-title scrollable>
         <v-spacer></v-spacer>
         <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
         <v-btn flat color="primary" @click="$refs.menu2.save(date2)">OK</v-btn>
       </v-date-picker>
     </v-menu>
<!-- SELECT LISTS -->
      <vselect class="dropdown"
      placeholder="User status"
      :options="options"
      :loading="loading"
       v-model="selected"
       ref="status"
       @input="depChange(selected.label)"></vselect>
       <p v-if="error" style="color:red;">{{ errorMsg }}</p>

         <vselect
         scrollable
         id="select"
         name="alo"
         class="dropdown"
         placeholder="User by status"
         :options="options2"
         :loading="loading"
          v-model="depSelected"
          @search="searchParam"></vselect>



       <!-- DUMMY VSELECT START -->
       <vselect
          placeholder="More options"
          class="dropdown"
         :items="items"
         v-model="value"
         label="label"
       ></vselect>
       <vselect
          placeholder="More options"
          class="dropdown"
         :items="items"
         v-model="value"
         label="label"
       ></vselect>
       <vselect
          placeholder="More options"
          class="dropdown"
         :items="items"
         v-model="value"
         label="label"
       ></vselect>
       <!-- DUMMY VSELECT END -->
       </v-form>
       <!-- CLEAR ALL SEARCH PARAMS -->
       <v-btn flat outline :loading="loading" color="error" @click="clearParams">Clear search</v-btn>
    </v-flex>
  </transition>

    <transition name="data" appear>
    <!-- DATA TABLE -->
    <v-flex xs10 md9 class="ma-1">
      <!-- INFO POPUP WHEN USER PROFILE IS EDITED -->
      <v-snackbar
      v-model="snackbar"
      top
      class="white--text"
      color="primary"
      multi-line
    >
      User edit success
      <v-btn
        color="yellow"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
      <!--  -->


      <!-- DATA TABLE -->
      <div class="tableWrap">
        <v-card>
          <!-- PAGINATION SECTION -->
          <v-card-title>
            <div><v-btn flat  @click='prev' color="primary">prev</v-btn>
              <h3 class="d-inline" style="color:#616161;">page {{ page }} of {{ pageNumber }}</h3>
              <v-btn flat  @click='next' color="primary">next</v-btn>
            </div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchWord" @keyup="searchData"
              append-icon="search"
              label="Search"
              single-line
              hint="please enter at least 3 characters"
            ></v-text-field>
          </v-card-title>
          <!--  -->

          <v-data-table
            :headers="testHeaders"
            indeterminate: false
            :items="testDesserts"
            :search="searchWord"
            :loading="loading"
            class="elevation-1 mt-1"
            hide-actions
            expand
          >
            <template slot="items" slot-scope="props">

            <tr @click="props.expanded = !props.expanded; showUserInfo(props.item.id)"
                style="cursor: pointer;"  >

              <td>{{ props.item.ime }}</td>

              <td>{{ props.item.status }}</td>

              <td>{{ props.item.cifra }}</td>

              <td class="right">
                <!-- ICON BUTTONS WITH TOOLTIPS -->
                <v-tooltip bottom>
                  <v-btn
                  slot="activator"
                  v-if="props.item.status==1||props.item.status==3||props.item.status==5"
                  @click.stop="showPdf"
                  fab
                  small
                  flat
                  color="info">
                    <v-icon color="info">search</v-icon>
                  </v-btn>
                  <span>View document</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <v-btn
                  slot="activator"
                  v-if="props.item.status==4||props.item.status==3||props.item.status==2||props.item.status==0"
                  @click.stop="showEditDialog(props.item.id)"
                  small
                  fab
                  flat
                  color="primary">
                    <v-icon color="primary">edit</v-icon>
                 </v-btn>
                 <span>Edit user</span>
               </v-tooltip>

                <v-tooltip bottom>
                 <v-btn
                   slot="activator"
                   v-if="props.item.status==0||props.item.status==3"
                   small
                   fab
                   flat
                   color="error"
                   >
                     <v-icon color="error">delete</v-icon>
                 </v-btn>
                 <span>Delete user</span>
               </v-tooltip>
              </td>
              <!--  -->
            </tr>
            </template>
            <!-- EXPANSION PANEL FOR SPECIFIC ROW -->
            <template slot="expand">
              <v-layout row wrap class="grey lighten-3">
                <v-flex xs4>
                  <v-card flat class="pa-2 grey lighten-3">
                    <h2 class="mb-2">User info:</h2>
                    <p>Id: {{ selectedUser.str_id }}
                    <br>Username: {{ selectedUser.str_ime}}
                    <br>Status: {{ selectedUser.str_status}}
                    <br>Number: {{ selectedUser.str_cifra}}</p>
                  </v-card>
                </v-flex>
                  <v-flex xs4>
                    <v-card flat class="pa-2 grey lighten-3">
                      <h2 class="mb-2">More info:</h2>
                      <p>Address: Takovska 10
                      <br>Country: Serbia
                      <br>Zip code: 11000
                      <br>Region: Central Serbia</p>
                    </v-card>
                  </v-flex>
                  <v-flex xs4>
                    <v-card flat class="pa-2 grey lighten-3">
                      <h2 class="mb-2">Contact:</h2>
                      <p>Social: @....
                      <br>Email: contact@info.com
                      <br>Phone number(home): 011/111-111
                      <br>Phone number(work): 066/222-222</p>
                    </v-card>
                  </v-flex>
              </v-layout>
            </template>
            <!--  -->
          </v-data-table>
        </v-card>

      </div>
    </v-flex>
  </transition>
    <!-- END OF DATA TABLE -->
  </v-layout>

  <!-- MODAL -->
  <editdialog :contacts="contacts" :dialog="dialog" @closeDialog="changeDialog" @refresh="refresh()"></editdialog>


  <!-- MODAL PDF -->
  <v-dialog
    v-model="dialogPdf"
    fullscreen
    :overlay="false"
    transition="dialog-transition"
  >
    <v-layout row wrap class="modal" @click="dialogPdf=false">
      <v-flex xs10 offset-xs1>
        <pdf :src="image"></pdf>
      </v-flex>
    </v-layout>
  </v-dialog>


  </div>
</template>


<script>
import vuescroll from 'vue-scroll'
import pdf from 'vue-pdf'
import vSelect from 'vue-select'
import EditDialog from '@/components/EditDialog.vue'
export default {
  components: {
    editdialog: EditDialog,
    vselect: vSelect,
    pdf
  },
  data() {
    return {
      logged: this.$store.state.logged,
      status:null,
      snackbar: false,
      searchInProgress: false,
      items:null,
      value:null,
      items: [6,7,8,9],
      options: [],
      options2: [],
      selected: '',
      search: '',
      scrolling: false,
      loading: false,
      searchTable: '',
      showInfo: false,
      showEdit: false,
      showDelete: false,
      page: 1,
      pageNumber: 1,
      selectPage: 0,
      searchWord: '',
      depSelected: '',
      testDesserts: [],
      testHeaders: [
        { text: 'Name', value: 'ime' },
        { text: 'Status', value: 'status' },
        { text: 'Number', value: 'cifra' },
        { text: '--', value: '--' }
      ],
      date: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      error:false,
      errorMsg:'',
      selectedUser:[],
      showNow: false,
      dialog: false,
      dialogPdf: false,
      image: '',
      active: null,
      contacts:[
        { id:10,
          name:'Marko',
          desc:'',
          status:0
        },
        { id:20,
          name:'Info',
          desc:'37480',
          status:1
        },
        { id:30,
          name:'Details',
          desc:'947772',
          status:2
      }
      ]
    }
  },
  mounted(){
    // CHECKING IF USER IS LOGGED AND FETCHING DATA
    if(this.logged==false)
      this.$router.push('/');

    axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getData.js').
    then(response => {
      for(var i = 0; i<response.data.res2.length; i++){
        var obj = {
          label: response.data.res2[i].str_status,
          value: response.data.res2[i].str_status
        };
        this.options.push(obj);
        this.items.push(response.data.res2[i].str_status);
      }
    })
  },
  methods: {
    clearParams(){
      this.searchWord = '';
      this.depSelected = '';
      this.selected = '';
      this.status = null;
      this.testDesserts = [];
      this.page = 1;
      this.pageNumber = 1;
    },
    refresh(){
      // REFRESHING DATA WHEN EDITED AND SHOWING INFO POPUP
      this.searchData();
      this.snackbar = true;
      this.clearParams();
    },
    changeDialog(){
      // CLOSING POPUP AFTER LISTENING FOR EVENT FROM EDIT DIALOG COMPONENT
      this.dialog = false;
    },
    showPdf(){
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getBase64')
      .then(response=>{
        this.image=response.data.img;
      })
      this.dialogPdf = true;
    },
    showEditDialog(id){
      // SHOWING EDIT DIALOG FOR SPECIFIC USER
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/showUserInfo',{
        params:{ id }
      }).then(response=>{
        this.contacts[0].id = response.data.res.str_id;
        this.contacts[0].name = response.data.res.str_ime;
        this.contacts[0].desc = response.data.res.str_cifra;
        this.contacts[0].status = response.data.res.str_status;
      })
      this.dialog = true;
    },
    showUserInfo(id){
      // GETTING DATA FOR EXPANSION PANEL
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/showUserInfo',{
        params:{ id }
      }).then(response=>{
        this.selectedUser = response.data.res;
      })
    },
    startSearch(){
      // START SEARCH WITH PARAMS FROM FILTER SIDEBAR
      // CHECKING IF USER STATUS IS SELECTED
      if(this.selected==''){
        this.errorMsg = 'Please select status';
        this.error = true;
        this.$refs.status.$el.style = 'border-bottom: 1px solid red;';
        setTimeout(()=>{
          this.$refs.status.$el.style = 'border-bottom: 0px;';
          this.error = false;
          this.errorMsg = '';
        },3000);
      }
      else{
        this.loading = true;
        this.$refs.status.$el.style = 'border-bottom: 0px;';
        this.error = false;
        this.errorMsg = '';
        this.testDesserts=[];
        this.page=1;
        this.status = this.selected.value;
        axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/startSearch',{
          params: {
            status: this.status,
            keyWord: this.depSelected.value || this.searchWord
          }
        }).then(response=>{
          for(var i = 0; i<response.data.res.length; i++){
            var obj = {
              id: response.data.res[i].str_id,
              ime: response.data.res[i].str_ime,
              status: response.data.res[i].str_status,
              cifra: response.data.res[i].str_cifra
            };
            this.testDesserts.push(obj);
          }
          this.loading = false;
          this.pageNumber=response.data.pageNumber;
        })
      }
    },
    // SEARCH FOR LETTERS OR WORDS IN DEPENDENT SELECT LIST
    searchParam(search,loading){
      if(this.searchInProgress == false){
      this.searchInProgress = true;
      this.searchWord = search;
      loading=true;
      this.options2=[];
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/searchParam',{
        params: {
          status: this.selected.value,
          keyWord: search
        }
      }).then(response=>{
        for(var i = 0; i<response.data.res.length; i++){
          var obj = {
            label: response.data.res[i].str_ime,
            value: response.data.res[i].str_ime
          };
          this.options2.push(obj);
        }
      }).then(response =>{
        loading=false;
      })
    }
    this.searchInProgress = false;
    },
    searchData(){
      // SEARCHING ALL DATA AFTER THIRD LETTER INPUT
      if(this.searchInProgress == false && this.searchWord.length > 2){
      this.searchInProgress = true;
      this.loading = true;
      this.testDesserts=[];
      this.page = 1;
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/searchData',{
        params:{
          keyWord: this.searchWord
        }
      }).
      then(response => {
        for(var i = 0; i<response.data.res.length; i++){
          var obj = {
            id: response.data.res[i].str_id,
            ime: response.data.res[i].str_ime,
            status: response.data.res[i].str_status,
            cifra: response.data.res[i].str_cifra
          };
          this.testDesserts.push(obj);
        }
        this.pageNumber=response.data.pageNumber;
      }).then(response =>{
        this.loading = false;
      })
      this.searchInProgress = false;
      }
    },
    // PREVIOUS PAGE BUTTON IF THERE IS ONE
    prev(){
      if(this.page>1){
        this.testDesserts=[];
        this.page-=1;
        axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getData.js',{
          params:{ page: this.page, keyWord: this.searchWord,status: this.status }
        }).
        then(response => {
          for(var i = 0; i<response.data.res.length; i++){
            var obj = {
              id: response.data.res[i].str_id,
              ime: response.data.res[i].str_ime,
              status: response.data.res[i].str_status,
              cifra: response.data.res[i].str_cifra
            };
            this.testDesserts.push(obj);
          }
        })
      }
    },
    // NEXT PAGE BUTTON IF THERE IS ONE
    next(){
      if(this.testDesserts.length>=19){
      this.testDesserts=[];
      this.page+=1;
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getData.js',{
        params:{ page: this.page,keyWord: this.searchWord,status: this.status }
      }).
      then(response => {
        for(var i = 0; i<response.data.res.length; i++){
          var obj = {
            id: response.data.res[i].str_id,
            ime: response.data.res[i].str_ime,
            status: response.data.res[i].str_status,
            cifra: response.data.res[i].str_cifra
          };
          this.testDesserts.push(obj);
        }
      })
    }
    },
    depChange(selected) {
      // GETTING DATA FOR DEPENDENT SELECT LIST BASED ON SELECTED USER STATUS
      this.status = selected;
      this.options2=[];
      axios.get('http://739k121.mars-e1.mars-hosting.com/fadata/getDependData.js',{
        params: {
          status: selected
        }
      }).then(response=>{
        for(var i = 0; i<response.data.res.length; i++){
          var obj = {
            label: response.data.res[i].str_ime,
            value: response.data.res[i].str_ime
          };
          this.options2.push(obj);
        }
      })
    }

  }
}
</script>

<style scoped>
.data-enter-active{
  animation: slide-top 1s ease-out;
}
@keyframes slide-top{
  from{
    transform: translateY(-20px);
  }
  to{
    transform: translateY(0);
  }
}

.side-enter-active{
  animation: slide-in 1s ease-out;
}

@keyframes slide-in{
  from{
    transform: translateX(20px);
  }
  to{
    transform: translateX(0)
  }
}

body {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  -moz-text-size-adjust: none;

}
h1 {
  font-size: 26px;
  font-weight: 600;
}
.dropdown {
  display: block;
  margin-top:5px;
  margin-bottom: 10px;

}
.tableWrap{
  max-height: 80vh;
  overflow: auto;
  /* border: 5px solid rgba(0,0,0,0.5);
  border-radius: 5px; */
}
input{
  background-color: white;
  border: 1px solid black;
  margin: 10px;
  padding-left: 5px;
  font-size: 18px;
}
.modal{
  border:1px solid white;
  background-color: rgba(0, 0, 0,0.2);
  padding: 5%;
}
.sidebar{
  background-color: white;
  height: 80vh;
  border-radius: 2px;
}


</style>
