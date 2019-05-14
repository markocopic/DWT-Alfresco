<template>
  <v-container text-xs-center fluid fill-height>
    <v-layout wrap justify-center>
     
        <v-flex xs2>
          
          <div id="dwtcontrolContainer"></div>
         
          <v-text-field dark v-model="comment" placeholder=" comment text"></v-text-field>
          
          <v-btn class="d-inline-block btn" @click="AddComment">add comment</v-btn>
          
          <v-btn class="d-inline-block btn" @click="EditComment">comment mode</v-btn>

          <v-btn class="d-inline-block btn" @click="AcquireImage">quick scan</v-btn>

          <v-btn class="d-inline-block btn" @click="UploadImage">save files</v-btn>

          <v-btn class="d-inline-block btn" @click="ShowImage">load files</v-btn>

          <v-btn class="d-inline-block btn" @click="LoadImage">load PDF</v-btn>

          <v-btn class="d-inline-block btn" @click="input = true">add new doc group</v-btn>


          <vselect  class="d-inline-block btn white mt-2"
          placeholder="Select document"
          :options="options"
          :loading="loading"
          v-model="selected"
          @input="setId(selected)">
          </vselect>

        </v-flex>

          <v-flex xs10>
            <v-snackbar
              v-model="snackbar"
              top
              class="white--text"
              color="red"
              multi-line
            >
              Please select document
              from dropdown menu...
              <v-btn
                color="yellow"
                flat
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </v-snackbar>

            <div id="dwtcontrolContainerLarge" class="d-inline-block"></div>
            
          </v-flex>
          
          
    </v-layout>

    <!-- ADD NEW DOC NAME DIALOG -->
    <v-dialog
      v-model="input" 
      max-width="500px"
      transition="dialog-transition"
    >
        <v-text-field class="ma-2" dark v-model="docName" placeholder="enter doc name"></v-text-field>
        <v-btn class="d-inline-block" @click="AddNewDocGroup">confirm doc name</v-btn>
    </v-dialog>

    <!-- SHOW GROUPED DOCS DIALOG -->
    <v-dialog
      v-model="showGrouped" 
      max-width="500px"
      transition="dialog-transition"
    >
      <v-list class="ma-2">
        <v-list-tile-title class="ma-2">Document groups:</v-list-tile-title>
          <v-list-tile class="ma-2" avatar v-for="(doc,index) in docArray" :key="index">
            <v-list-tile-content class="ma-2">{{index+1}}. {{doc.name}}  / {{doc.files.length}} selected files{{doc.files}}</v-list-tile-content>
          </v-list-tile>
          <v-btn @click="postNewDoc">confirm</v-btn> 
          <v-btn @click="showGrouped = false; docArray = [];">cancel</v-btn>
      </v-list>  
    </v-dialog>
    <!-- LOADER WHILE WAITING FOR DATA -->
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Please stand by
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    
  </v-container>
</template>

<script>

import vselect from 'vue-select'

export default {
  components:{
    vselect
  },
  mounted() {
    var self = this;
    axios.get(this.baseURL + 'alfresco/versions/1/nodes/45dbad81-e657-4020-9266-e09dc597c25f/children?skipCount=0&maxItems=100',{
      headers:{
        Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
      }
    }).then(response => {
      console.log(response.data.list.entries);
      let entries = response.data.list.entries
      for(let entry in entries){
        var obj = {
          label: entries[entry].entry.name,
          value: entries[entry].entry.id
        };
        this.options.push(obj);
      }
    })


    Dynamsoft.WebTwainEnv.CreateDWTObject(
      "dwtcontrolContainer",
      function (newDWObject) { 
        self.DWObject = newDWObject;
        self.DWObject.ShowImageEditor("dwtcontrolContainerLarge", 1200, 800);
        self.DWObject.SetViewMode(2, 4);
        self.DWObject.BackgroundFillColor = 0x000000;
        self.DWObject.RegisterEvent('OnImageAreaSelected', function(nImageIndex, left, top,
          right, bottom, sAreaIndex){
            self.left = left;
            self.top = top;
            self.fontSize = bottom - top;
        });
      },
      function (errorString) { 
        console.log(errorString);
      }
    );
      
  },
  data(){
    return {
      baseURL: this.$store.state.baseURL,
      image: '',
      imgData: '',
      scan: false,
      editor: false,
      DWObject: null,
      DWObjectEdit: null,
      comment:'',
      docArray: [],
      docName: '',
      input: false,
      showGrouped: false,
      isInitial:true,
      file: null,
      dialog:false,
      left: 0,
      top: 0,
      fontSize: 0,
      editing: true,
      users: [],
      bin: null,
      file: null,
      alfrescoPDF: '',
      options: [],
      selected: '',
      loading: false,
      Id: '',
      indexArr: [],
      snackbar: false
    }
  },
  methods:{
    postNewDoc(){
      let self = this;
      this.showGrouped = false; 
      for(let i = 0; i<this.docArray.length; i++){
        self.indexArr.push( self.docArray[i].files);
        
        let obj = {}
        obj.name = this.docArray[i].name + '.pdf';
        obj.nodeType = "cm:content";
          
        axios.post(this.baseURL + 'alfresco/versions/1/nodes/45dbad81-e657-4020-9266-e09dc597c25f/children?autoRename=true',
          JSON.stringify(obj),
          {
            headers:{
                Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
            }
        }).then(response => {
          let id = response.data.entry.id;
          this.DWObject.ConvertToBlob (self.indexArr[i], EnumDWT_ImageType.IT_PDF, asyncSuccessFuncBlob,
            asyncFailureFuncBlob);
          function asyncSuccessFuncBlob (result) {
            axios.put(self.baseURL + 'alfresco/versions/1/nodes/'+id+'/content?majorVersion=false',
              result,
              {
                headers:{
                  Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
                }
            }).then(response => {
              console.log(response);
            })
          }
          function asyncFailureFuncBlob (errorCode, errorString) {
            alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
          }
        })
      }
      this.docArray = [];
    },
    setId(val){
      if(val == null){
        this.Id = '';
        return;
      } 
      if(val!=='' || val !==null){
        this.Id = val.value;
      }
    },
    EditComment(){
      console.log('editmode');
      this.DWObject.ShowImageEditor("dwtcontrolContainerLarge", 1200, 800);
      this.editing = !this.editing;
      if(this.editing == true){
        this.DWObject.SetViewMode(2, 4);
      }else{
        this.DWObject.SetViewMode(1, 1);
      }
      
    },
    LoadImage() {
      if (this.DWObject) {
        // Please NOTE that the PDF Rasterizer doesn't work for Chrome/Firefox 26-			
        this.LoadImageInner();
      }
    },
    LoadImageInner() {
      if (this.DWObject) {
        if (this.DWObject.Addon.PDF.IsModuleInstalled()) {
          this.DWObject.Addon.PDF.SetResolution(200);
          this.DWObject.Addon.PDF.SetConvertMode(EnumDWT_ConvertMode.CM_RENDERALL);
        }
        this.DWObject.IfShowFileDialog = true; // Open the system's file dialog to load image
        
        this.DWObject.LoadImageEx("", EnumDWT_ImageType.IT_PDF, OnAcquireImageSuccess, OnAcquireImageFailure); // Load images in all supported formats (.bmp, .jpg, .tif, .png, .pdf). OnSuccess or OnFailure will be called after the operation
      }
      var OnAcquireImageSuccess = function (){
        console.log('success');
      };
      var OnAcquireImageFailure = function (){console.log('fail') };
    },
    OnHttpUploadSuccess() {
      console.log('successful');
    },
    OnHttpUploadFailure(errorCode, errorString, sHttpResponse) {
      alert(errorString + sHttpResponse);
    },
    GoToBarcode(){
       Dynamsoft.WebTwainEnv.DeleteDWTObject('dwtcontrolContainer');
       Dynamsoft.WebTwainEnv.DeleteDWTObject('dwtcontrolContainerLarge');
      this.DWObject.CloseSource(); 
      this.$router.push('/barcode');
    },
    AddNewDocGroup(){
      this.input = false;
      let self = this;
      let arr = [];
      for (let i = 0; i < this.DWObject.SelectedImagesCount; i++) {
         arr.push(self.DWObject.GetSelectedImageIndex(i));
      }
      let obj = {};
      obj.name = this.docName;
      obj.files = arr;
      this.docArray.push(obj);
    },
    AddComment(){
      this.DWObject.CreateTextFont(this.fontSize, this.fontSize/2 , 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, "Arial");
      this.DWObject.AddText(this.DWObject.GetSelectedImageIndex(0), this.left, this.top, this.comment, 0x0000ff, 0xffffff, 0.5, 0.5);
    },
    optionalAsyncSuccessFunc(){
      console.log('success');
      
    },
    optionalAsyncFailureFunc(){
      console.log('fail');
      
    },
    ShowImage(){
      console.log(this.Id);
      if(this.Id == '' || this.Id == undefined || this.Id == null){
        this.snackbar = true;
        return;
      }   
      this.DWObject.SetHTTPHeader('Authorization','Basic ' + btoa(sessionStorage.getItem('id')));
      this.DWObject.HTTPDownload(this.baseURL,'alfresco/versions/1/nodes/'+this.Id+'/content?attachment=true',
       this.optionalAsyncSuccessFunc,
       this.optionalAsyncFailureFunc);
    },
    UploadImage(){
      if(this.docArray.length < 1){
        if(this.Id == '' || this.Id == undefined || this.Id == null){
          this.snackbar = true;
          return;
        }
        let self = this;
        let arr = [];
        let imagedata;
        for (let i = 0; i < this.DWObject.SelectedImagesCount; i++) {
          arr.push(self.DWObject.GetSelectedImageIndex(i));
          self.DWObject.ConvertToGrayScale(self.DWObject.GetSelectedImageIndex(i));
        }
        
        this.DWObject.ConvertToBlob (arr, EnumDWT_ImageType.IT_PDF, asyncSuccessFuncBlob,
          asyncFailureFuncBlob);
        function asyncSuccessFuncBlob (result) {
          axios.put(self.baseURL + 'alfresco/versions/1/nodes/'+self.Id+'/content?majorVersion=false',
            result,
            {
              headers:{
                Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
              }
          }).then(response => {
            console.log(response);
          })
        }
        function asyncFailureFuncBlob (errorCode, errorString) {
          alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
        }
      }else{
        this.showGrouped = true;
      }
        
    },
    AcquireImage(){
      var self = this;
      if (this.DWObject) {
        this.DWObject.OpenSource();
        this.DWObject.Resolution = 300;
        //this.DWObject.PixelType = EnumDWT_PixelType.TWPT_GRAY;  
        this.DWObject.IfShowUI = false;
        var OnAcquireImageSuccess = function (){
          console.log('success');
        };
        var OnAcquireImageFailure = function (){console.log('fail') };
          
        this.DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
          
        this.DWObject.CloseSource();    
      }
    }
  }
}
</script>

<style scoped>
.show{
  display: inline-block;
}
.hide{
  display: none;
}
.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: transparent;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: rgba(255,255,255,0.1); /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

.btn{
  width:90%;
  height: 27px;
  cursor: pointer;
}
.v-enter-active {
  -webkit-animation: rotate-in-diag-2 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: rotate-in-diag-2 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
.v-leave-active {
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
