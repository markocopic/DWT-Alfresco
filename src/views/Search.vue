<template>
<div class="main mt-5" align-content-center>

  <v-layout justify-center row wrap class="pt-2 mt-5">
    <transition name="side" appear>
<!-- SIDEBAR MENU WITH SEARCH FILTERS -->
    <v-flex xs10 sm6 md2 order-lg2 class="sidebar pa-3 ma-1 text-sm-center">
      <v-btn :loading="loading" class="indigo white--text" @click="startSearch">Start search</v-btn>
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
                <v-btn flat color="indigo" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="indigo" @click="$refs.menu.save(date)">OK</v-btn>
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
                <v-btn flat color="indigo" @click="menu2 = false">Cancel</v-btn>
                <v-btn flat color="indigo" @click="$refs.menu2.save(date2)">OK</v-btn>
            </v-date-picker>
        </v-menu>

        <v-checkbox v-model="checkboxPdf" label="Show only PDF files"></v-checkbox>
        <v-checkbox v-model="checkboxFolder" label="Show only folders"></v-checkbox>  

       </v-form>
       <!-- CLEAR ALL SEARCH PARAMS -->
       <v-btn flat outline :loading="loading" color="error" @click="clearParams">Clear search</v-btn>
       <div id="dwtcontrolContainer2" style="visibility: hidden;!important"></div>
    </v-flex>
  </transition>

    <v-flex xs5 md4 class="ma-1" text-xs-center>
        <h1 v-if="!image" class="grey--text mt-5 pt-5">Preview Document...</h1>
        <div v-if="image" style="overflow:auto; height:80vh;">
            <v-btn @click="download" class="indigo white--text mb-3" style="width:90%;">Download file</v-btn>    
            <pdf
                v-for="i in numPages"
                :key="i"
                :src="image"
                :page="i"
                style="display:block; width: 90%; margin-bottom: 10px;margin-left: 5%"
            ></pdf>
        </div> 
    </v-flex>



    <transition name="data" appear>
    <!-- DATA TABLE -->
    <v-flex xs5 md4 class="ma-1 tableWrap" style="background-color: white">
      <!-- INFO POPUP WHEN USER PROFILE IS EDITED -->
      <v-snackbar
      v-model="snackbar"
      top
      class="white--text"
      color="blue-grey"
      multi-line
    >
      {{msg}}
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
        <v-card class="ma-2">
          <!-- PAGINATION SECTION -->
          <v-card-title>
            <div><v-btn :disabled="!hasPrev" flat  @click='prev' color="primary">prev</v-btn>
              <h3 class="d-inline" style="color:#616161;">page {{ page }} of {{ pageNumber }}</h3>
              <v-btn :disabled="!hasNext" flat  @click='next' color="primary">next</v-btn>
            </div>

            <v-spacer></v-spacer>

            <v-radio-group v-model="maxItems">
                <v-radio color="indigo" label="Show 5 results" :value="5"></v-radio>
                <v-radio color="indigo" label="Show 10 results" :value="10"></v-radio>
                <v-radio color="indigo" label="Show 20 results" :value="20"></v-radio>
            </v-radio-group>

              <div style="width:100%;" class="ma-0 pa-0" v-for="(i,index) in n" :key="i">
             <vselect class=" mx-1 d-inline-block" style="width:200px;"
                placeholder="Search by"
                :options="options"
                :loading="loading"
                :disabled="i!=n"
                v-model="list[index].property"
                ref="status"
              >
             </vselect>

             <v-text-field
              :disabled='list[index].property==null || loading == true || i!=n'
              v-model="list[index].searchTerm" @keyup="searchData"
              append-icon="search"
              class="ml-3 mr-4 pr-2 d-inline-block"
              label="Search"
              single-line
              hint="please enter at least 3 characters"
              style="width:40%;"
             ></v-text-field>
             <v-icon v-if="i==n-1" @click="removeSearch" small dark class="red">remove</v-icon> 
             <v-icon v-if="i==n && i<3" @click="addNewSearch" small dark class="indigo">add</v-icon>
            </div>
            <!-- <caption v-if="selected==null" style="color:red;font-size:10px;display:block;margin:0 auto;">Please select type of search</caption> -->
          </v-card-title>
          

          <v-data-table
            :headers="testHeaders"
            :items="testDesserts"
            item-key="entry.name"
            :loading="loading"
            class="elevation-1 mt-1"
            hide-actions
            :expand="false"
          >
            <template slot="items" slot-scope="props">

            <tr @click="props.expanded = !props.expanded"
                style="cursor: pointer;">

              <td>{{ props.item.entry.name }}</td>

              <td>{{ props.item.entry.modifiedByUser.displayName }}</td>

              <td>{{ props.item.entry.modifiedAt | formatDate }}</td>

              <td>
                <v-btn class="right" fab @click="showUserInfo(props.item.entry.id)" flat color="indigo">
                    <v-icon>search</v-icon>    
                </v-btn>
              </td>

              
              <!--  -->
            </tr>
            </template>
            <!-- EXPANSION PANEL FOR SPECIFIC ROW -->
            <template slot="expand" slot-scope="props">
              <v-layout row wrap class="grey lighten-3">
                <v-flex xs6>
                  <v-card flat class="pa-2 grey lighten-3">
                    <h2 class="mb-2">File info:</h2>
                    <p>Id: {{ props.item.entry.id }}
                    <br>Modified by: {{ props.item.entry.modifiedByUser.displayName }}
                    <br>Modified at: {{ props.item.entry.modifiedAt | formatDate }}</p>
                  </v-card>
                </v-flex>
                  <v-flex xs6>
                    <v-card flat class="pa-2 grey lighten-3">
                      <h2 class="mb-2">Properties:</h2>
                      <p>Title: {{ props.item.entry.properties['cm:title'] }}
                      <br>Desc: {{ props.item.entry.properties['cm:description'] }}
                      <br>Subject: {{ props.item.entry.properties['cm:subject'] }}
                      <br>Meta: {{ props.item.entry.properties['csm:metapodatak'] }}</p>
                    </v-card>
                  </v-flex>
              </v-layout>
            </template>
            <!--  -->
          </v-data-table>
        </v-card>

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
import FileSaver from 'file-saver'
import {saveAs} from 'file-saver'
import EditDialog from '@/components/EditDialog.vue'
export default {
  components: {
    editdialog: EditDialog,
    vselect: vSelect,
    pdf,
    FileSaver
  },
  data() {
    return {
      list: [{property:null,searchTerm:''}],
      n: 1,
      logged: this.$store.state.logged,
      status:null,
      snackbar: false,
      items:null,
      value:null,
      items: [6,7,8,9],
      options:[
        { label:'Name',
          value:'cm:name:'
        },
        { label:'Title',
          value:'cm:title:'
        },
        { label:'Description',
          value:'cm:description:'
        },
        { label:'Modified by',
          value:'cm:modifier:'
        },
        { label:'Subject',
          value:'cm:subject:'
        },
        { label:'Meta podatak',
          value:'csm:metapodatak:'
        }
      ],
      options2: [],
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
        { text: 'Modified by', value: 'status' },
        { text: 'Date modified', value: 'cifra' },
        { text: 'Preview', value: '--' }
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
      ],
      DWObject2: null,
      numPages: undefined,
      checkboxPdf: false,
      checkboxFolder: false,
      msg:'',
      maxItems: 5,
      skipCount: 0,
      hasPrev: false,
      hasNext: false
    }
  },
  filters: {
        formatDate: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.slice(0,10)
        }
    },
  mounted(){
      let self = this;
      Dynamsoft.WebTwainEnv.CreateDWTObject(
            "dwtcontrolContainer2",
            function (newDWObject) { 
                self.DWObject2 = newDWObject;
                 },
            function (errorString) { 
                console.log(errorString);
                 }
            );
  },
  methods: {
    addNewSearch(){
      this.list.push({property:null,searchTerm:''});
      this.n+=1;
    },
    removeSearch(){
      this.list.pop();
      this.n-=1;
    },
    download(){
        let self = this;
        let arr = [];
        for (let i = 0; i <self.DWObject2.HowManyImagesInBuffer; i++) {
            arr.push(i);
        }
        self.DWObject2.ConvertToBase64 (arr, EnumDWT_ImageType.IT_PDF, asyncSuccessFunc,
        asyncFailureFunc);
        function asyncSuccessFunc(result){
            var length=result.getLength();
            let file = 'data:application/pdf;base64,'+result.getData(0,length);
            FileSaver.saveAs(file, "document.pdf");
        }
        function asyncFailureFunc (errorCode, errorString) {
        alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
        }
    },  
    optionalAsyncSuccessFunc(){
        let self = this;
        let arr = [];
        for (let i = 0; i <self.DWObject2.HowManyImagesInBuffer; i++) {
            arr.push(i);
        }
        
        self.DWObject2.ConvertToBase64 (arr, EnumDWT_ImageType.IT_PDF, asyncSuccessFunc,
            asyncFailureFunc);
        function asyncSuccessFunc (result) {
            var length=result.getLength();
            self.image = 'data:application/pdf;base64,'+result.getData(0,length);
            let loadingTask = pdf.createLoadingTask(self.image);
            loadingTask.then(pdf =>{self.numPages = pdf.numPages});
        }
        function asyncFailureFunc (errorCode, errorString) {
            alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
        }
    },
    optionalAsyncFailureFunc(){
        console.log('fail');
        
    },  
    clearParams(){
      this.searchWord = '';
      this.depSelected = '';
      this.n = 1;
      this.list = [{property:null,searchTerm:''}];
      this.status = null;
      this.testDesserts = [];
      this.page = 1;
      this.pageNumber = 1;
      this.checkboxPdf = false;
      this.checkboxFolder = false;
      this.date = new Date().toISOString().substr(0, 10);
      this.date2 = new Date().toISOString().substr(0, 10);
      this.DWObject2.RemoveAllImages();
      this.image = '';
      this.hasNext = false;
      this.hasPrev = false;
    },
    refresh(){
      // REFRESHING DATA WHEN EDITED AND SHOWING INFO POPUP
      
    },
    changeDialog(){
      // CLOSING POPUP AFTER LISTENING FOR EVENT FROM EDIT DIALOG COMPONENT
      this.dialog = false;
    },
    showPdf(){
      
    },
    showEditDialog(id){
      // SHOWING EDIT DIALOG FOR SPECIFIC USER
      
    },
    showUserInfo(id){
        let self = this;
        let token = 'Basic ' + btoa(sessionStorage.getItem('id'));
        self.DWObject2.RemoveAllImages();
        self.DWObject2.SetHTTPHeader('Authorization',token);
            self.DWObject2.HTTPDownload('https://cors-anywhere.herokuapp.com','/http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id+'/content?attachment=true',
             self.optionalAsyncSuccessFunc,
             self.optionalAsyncFailureFunc);
       
    },
    startSearch(){
        this.searchData(true);
    },
    // SEARCH FOR LETTERS OR WORDS IN DEPENDENT SELECT LIST
    searchParam(search,loading){
      
    },
    searchData(date,skipCount){
      let self = this;
      self.image = '';
      self.DWObject2.RemoveAllImages();
      if(skipCount){
        this.skipCount = skipCount;
      }
      else{
          this.skipCount = 0;
      } 
      if(this.date2 < this.date){
          this.msg = 'Invalid date range!';
          this.snackbar = true;
          return;
      }  
      // SEARCHING ALL DATA AFTER THIRD LETTER INPUT
      if((this.loading == false && this.searchWord.length > 2) || date == true){
      this.loading = true;
      this.testDesserts=[];
      let dateRange = "cm:modified:['"+this.date+ "' TO '" +this.date2+ "']";
      let filters = [];
      for (let i = 0; i < self.list.length; i++) {
        if(self.list[i].property!=null && self.list[i].searcTerm!=''){
          filters.push({"query":self.list[i].property.value+self.list[i].searchTerm+"*"}); 
        }
      }
      
      if(self.checkboxFolder){
        filters.push({"query" : "TYPE:'cm:folder'"});
      }else if(self.checkboxPdf){
        filters.push({"query": "cm:content.mimetype:application/pdf"});
      } 
      
      axios.post('https://cors-anywhere.herokuapp.com/http://35.204.234.73/alfresco/api/-default-/public/search/versions/1/search',
          {
             "query":{
                 "query":dateRange
             },
             "paging": {
                    "maxItems": this.maxItems,
                    "skipCount": this.skipCount
             },
             "filterQueries": filters,
             include: ["properties"]
          },
          {
              headers:{
                     Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
                 }
          }).then(response =>{
            console.log(response);
            this.pageNumber = Math.ceil(Number(response.data.list.pagination.totalItems)/this.maxItems);
            Number(response.data.list.pagination.totalItems) < 1 ? this.pageNumber = 1 : 0;
            response.data.list.pagination.hasMoreItems ? this.hasNext = true : this.hasNext = false;
            this.skipCount > 0 ? this.hasPrev = true : this.hasPrev = false;
            this.page = this.skipCount/this.maxItems + 1;
            this.testDesserts = response.data.list.entries;
            this.loading = false;
          })
      }
    },
    // PREVIOUS PAGE BUTTON IF THERE IS ONE
    prev(){
       if(!this.loading){
        this.skipCount -= this.maxItems;
        this.searchData(true,this.skipCount);
      }
    },
    // NEXT PAGE BUTTON IF THERE IS ONE
    next(){
      if(!this.loading){
        this.skipCount += this.maxItems;
        this.searchData(true,this.skipCount);
      }
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
  overflow:hidden;
}


</style>
