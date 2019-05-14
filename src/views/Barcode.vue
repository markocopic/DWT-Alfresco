<template>
  <v-container text-xs-center fluid fill-height>

    <v-snackbar
      v-model="snackbar"
      top
      class="white--text"
      color="blue-grey"
      multi-line
      >
        {{ msg }}
        <br>
        {{ msgUpload }}
        <v-btn color="yellow" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-layout wrap justify-center>
        
      <!-- BARCODE READER -->

     <v-flex xs3 class="ma-2">
        <!-- <v-btn class="d-inline-block btn primary" @click="Logout">Logout</v-btn>
        <v-btn class="d-inline-block btn success" @click="goToSearch">Search</v-btn> -->
        <v-btn class="d-inline-block btn" @click="AcquireImage">Scan</v-btn>
        <v-btn class="d-inline-block btn" @click="LoadImage">Load PDF files</v-btn>
        <v-btn class="d-inline-block btn" @click="LoadImages">Load local files</v-btn>
        <v-btn class="d-inline-block btn" @click="ShowImage">Load from server</v-btn>
        <v-btn class="d-inline-block btn" @click="RemoveImages">Delete</v-btn>
        <v-btn class="d-inline-block btn" @click="SeparateFiles">Separate</v-btn>
        <v-select dark 
          v-model="select"
          :hint="`${select.exp}`"
          :items="modeOptions"
          item-text="desc"
          item-value="val"
          label="Select"
          persistent-hint
          return-object
          single-line>
        </v-select>

        <v-select dark 
          v-model="file"
          hint="Select document"
          :items="documents"
          item-text="label"
          item-value="value"
          persistent-hint
          return-object
          single-line>
        </v-select>

        <div style="color: #616161;background: white;text-align:left;margin-top:15px;padding: 5px;max-height: 400px;overflow: auto;">
          <h2>Documents:</h2>
          <v-divider></v-divider>
          <ul>
            <li v-for="(doc,i) in dispArr" :key="i">name: {{ doc.name }}  
              <ul>
                <li>title: {{ doc.title }}</li>
                <li>desc: {{ doc.description }}</li>
                <li v-if="doc.subject">subj: {{ doc.subject }}</li>
                <li v-if="doc.metapodatak">meta: {{ doc.metapodatak }}</li>
              </ul>
            </li>
          </ul>
        </div>
        
      </v-flex> 

     <v-flex xs8 class="ma-2">
        <div id="dwtcontrolContainer1"></div> 
     </v-flex> 
    
    </v-layout>

    <!-- PROMPT DOC DIALOG -->
    <v-dialog
      v-model="promptDialog" 
      transition="dialog-transition"
      persistent
      max-width="500px"
    >
      <div style="background: white;padding: 10px;">
        <h2>Document: {{ documentName }}     File: {{iteration}}/{{nameArr.length}}</h2>
        <v-text-field class="ma-2"  v-model="title" placeholder="enter title"></v-text-field>
        <v-text-field class="ma-2"  v-model="description" placeholder="enter description"></v-text-field>

        <v-text-field v-if="dublinCore" class="ma-2"  v-model="subject" placeholder="enter subject"></v-text-field>
        <v-text-field v-if="noviPodatak" class="ma-2"  v-model="metaPodatak" placeholder="enter meta-podatak"></v-text-field>
        
        <v-checkbox class="d-inline-block ma-2" v-model="dublinCore" label="Add Dublin core"></v-checkbox>
        <v-checkbox class="d-inline-block ma-2" v-model="noviPodatak" label="Add Novi podatak"></v-checkbox> 
        <v-btn class="d-block" @click="prompt">confirm</v-btn>
      </div>
        
    </v-dialog>

    <!-- FULLSCREEN LOADER DIALOG -->
    <v-dialog
      v-model="loaderDialog"
      hide-overlay
      persistent
      fullscreen
    >
      <v-layout align-center justify-center fill-height style="background: rgba(0, 1, 5, 0.4);"> 
        <v-flex xs10 sm4>
          <v-card
            color="blue-grey"
            dark
            class="mb-5"
          >
            <v-card-text>
              Uploading...
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-flex>  
      </v-layout>
    </v-dialog>
   
  </v-container>
</template>

<script>

export default {
  mounted() {


   let self = this;
   Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer1', Width: '100%', Height: '600px' }];    
   if (Dynamsoft && (!Dynamsoft.Lib.env.bWin || !Dynamsoft.Lib.product.bChromeEdition)) {
     var ObjString = [];
     ObjString.push('<div class="p15">');
     ObjString.push("Current browser is not supported, please use Chrome, Firefox, Edge or IE 11");
     ObjString.push('</div>');
     Dynamsoft.WebTwainEnv.ShowDialog(400, 180, ObjString.join(''));
     if (document.getElementsByClassName("dynamsoft-dialog-close"))
     document.getElementsByClassName("dynamsoft-dialog-close")[0].style.display = "none";
   }
   else{
     Dynamsoft.WebTwainEnv.Load();
   }
   Dynamsoft.WebTwainEnv.AutoLoad = false;
   //Dynamsoft.WebTwainEnv.ProductKey = '***';
   Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);
   function Dynamsoft_OnReady() {
   self.DWObject1 = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer1');
   self.dbrObject = new dynamsoft.BarcodeReader();
   if (self.DWObject1) {
     self.DWObject1.SetViewMode(3, 3);
     }
   }
   this.getDocumentData();
  },
  data(){
    return {
      baseURL: this.$store.state.baseURL,
      DWObject1: null,
      dbrObject: null,
      dialog: false,
      Id: '',
      msg: '',
      msgUpload: '',
      documents: [],
      file: '',
      snackbar: false,
      prompted: false,
      promptDialog: false,
      loaderDialog: false,
      meta: [],
      title: '',
      description: '',
      documentName: '',
      iteration: 0,
      nameArr:[],
      arrayArr:[],
      dispArr:[],
      dublinCore: false,
      noviPodatak: false,
      subject: '',
      metaPodatak: '',
      select: { desc: "Mode 1", val: 'mode1', exp: 'Start each document with an image with barcode' },
      modeOptions : [
          { desc: "Mode 1", val: 'mode1', exp: 'Start each document with an image with barcode' },
          { desc: "Mode 2", val: 'mode2', exp: 'Use the images with barcode as the separator only without including them in any document' },
          { desc: "Mode 3", val: 'mode3', exp: 'Each page has a Barode and the image with the same Barcode belongs to the same file' }
      ] 
    }
  },
  methods:{
    Logout(){
      sessionStorage.removeItem('id');
      this.$router.push('/auth');
    },
    goToSearch(){
      this.$router.push('/search');
    },
    LoadImage() {
      if (this.DWObject1) {
        // Please NOTE that the PDF Rasterizer doesn't work for Chrome/Firefox 26-			
        this.LoadImageInner();
      }
    },
    LoadImageInner() {
      if (this.DWObject1) {
        if (this.DWObject1.Addon.PDF.IsModuleInstalled()) {
          this.DWObject1.Addon.PDF.SetResolution(200);
          this.DWObject1.Addon.PDF.SetConvertMode(EnumDWT_ConvertMode.CM_RENDERALL);
        }
        this.DWObject1.IfShowFileDialog = true; // Open the system's file dialog to load image
        
        this.DWObject1.LoadImageEx("", EnumDWT_ImageType.IT_PDF, OnAcquireImageSuccess, OnAcquireImageFailure); // Load images in all supported formats (.bmp, .jpg, .tif, .png, .pdf). OnSuccess or OnFailure will be called after the operation
      }
      var OnAcquireImageSuccess = function (){
        console.log('success');
      };
      var OnAcquireImageFailure = function (){console.log('fail') };
    },
    getDocumentData(){
      this.documents = [];
      axios.get(this.baseURL + 'alfresco/versions/1/nodes/45dbad81-e657-4020-9266-e09dc597c25f/children?skipCount=0&maxItems=100',{
        headers:{
          Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
        }
      }).then(response => {
        let entries = response.data.list.entries
        for(let entry in entries){
          var obj = {
            label: entries[entry].entry.name,
            value: entries[entry].entry.id
          };
          this.documents.push(obj);
        }
      })
    },
    prompt(){
      if(this.iteration > 0){
        if(this.dublinCore == true && this.noviPodatak == true)
          this.meta.push({
            title: this.title, 
            description: this.description, 
            subject: this.subject, 
            metapodatak: this.metaPodatak
            })
        if(this.dublinCore == true && this.noviPodatak == false)
          this.meta.push({
            title: this.title, 
            description: this.description, 
            subject: this.subject
            })
        if(this.dublinCore == false && this.noviPodatak == true)
          this.meta.push({
            title: this.title, 
            description: this.description,  
            metapodatak: this.metaPodatak
            });
            
        if(this.dublinCore == false && this.metaPodatak == false)    
          this.meta.push({title: this.title, description: this.description});
        
        this.dispArr.push({name: this.documentName,title: this.title, description: this.description, subject: this.subject, metapodatak: this.metaPodatak});
      }
      this.promptDialog = false;
      this.title = '';
      this.description = '';
      this.subject = '';
      this.metaPodatak = '';
      if(this.iteration < this.nameArr.length){ 
        this.documentName = this.nameArr[this.iteration].text;
        this.iteration+=1;
        setTimeout(()=>{this.promptDialog = true},500);
      }else{ 
        this.uploadFiles(this.nameArr, this.arrayArr);
      } 
    },
    uploadFiles(nameArr, arrayArr){
      this.loaderDialog = true;
      let self = this;
      let invalidArr = [];
      let validArr = [];
      for (let i = 0; i < nameArr.length; i++) {
        let test = Number(nameArr[i].text.slice(-1));
        if(test%2 != 0){
          invalidArr.push(nameArr[i].text);
          continue;
        }else{
          validArr.push(nameArr[i].text);
        }
        let num = Math.round(Math.random()*1000);
        let obj = {}
        obj.name = nameArr[i].text+'-'+num;
        obj.nodeType = "cm:content";
        if(self.meta[i].metapodatak){
          obj.aspectNames = ["csm:NoviPodatak"];
          obj.properties = {
            "cm:title":self.meta[i].title,
            "cm:description":self.meta[i].description,
            "csm:metapodatak": self.meta[i].metapodatak
          }
          if(self.meta[i].subject){
            obj.aspectNames = ["csm:NoviPodatak","cm:dublincore"];
            obj.properties = {
              "cm:title":self.meta[i].title,
              "cm:description":self.meta[i].description,
              "cm:subject": self.meta[i].subject,
              "csm:metapodatak": self.meta[i].metapodatak
            }
          } 
        }else if(self.meta[i].subject){
          obj.aspectNames = ["cm:dublincore"];
          obj.properties = {
            "cm:title":self.meta[i].title,
            "cm:description":self.meta[i].description,
            "cm:subject": self.meta[i].subject
          }
          if(self.meta[i].metapodatak){
            obj.aspectNames = ["csm:NoviPodatak","cm:dublincore"];
            obj.properties = {
              "cm:title":self.meta[i].title,
              "cm:description":self.meta[i].description,
              "cm:subject": self.meta[i].subject,
              "csm:metapodatak": self.meta[i].metapodatak
            }
          } 
        }else{
          obj.properties = {
            "cm:title":self.meta[i].title,
            "cm:description":self.meta[i].description
          }
        }
          
        axios.post(this.baseURL + 'alfresco/versions/1/nodes/45dbad81-e657-4020-9266-e09dc597c25f/children?autoRename=true',
          JSON.stringify(obj),
          {
            headers:{
              Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
            }
        }).then(response => {
          this.DWObject1.ConvertToBlob (arrayArr[i], EnumDWT_ImageType.IT_PDF, asyncSuccessFuncBlob,
            asyncFailureFuncBlob);
          function asyncSuccessFuncBlob (result) {
            axios.put(self.baseURL + 'alfresco/versions/1/nodes/'+response.data.entry.id+'/content?majorVersion=false',
              result,
              {
                headers:{
                 Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
                }
            }).then(response => {
              self.msg = '';
              if(invalidArr.length > 0){
                self.msg = '( ';
                for (let i = 0; i < invalidArr.length; i++) {
                  self.msg += invalidArr[i];
                  if(i != invalidArr.length - 1)
                    self.msg += ' ,';
                } 
                  self.msg += ' ) failed to upload - odd barcode number';
              }
              self.msgUpload = '';
              if(validArr.length > 0){
                self.msgUpload = '( ';
                for (let i = 0; i < validArr.length; i++) {
                  self.msgUpload += validArr[i];
                  if(i != validArr.length - 1)
                    self.msgUpload += ' ,';
                }
                self.msgUpload += ' ) upload success - even barcode number';
              }
              self.loaderDialog = false;
              self.snackbar = true; 
              self.getDocumentData();
            })
          }
          function asyncFailureFuncBlob (errorCode, errorString) {
            alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
          }
        }).catch(error => {
          if(error.response.status == 403){
            this.msg = 'Not allowed to create a node!'
            self.loaderDialog = false;
            this.snackbar = true;
          }else if(error.response.status == 409){
            this.msg = 'File name already exists!'
            self.loaderDialog = false;
            this.snackbar = true;
          }else{
            this.msg = 'Something went wrong!'
            self.loaderDialog = false;
            this.snackbar = true;
          }
        })
      }
    },
    SeparateFiles() {
      let self = this;
      if(self.DWObject1.HowManyImagesInBuffer < 1) return; 
      self.DWObject1.IfShowProgressBar = false;
      let ProcssedImagesCount = 0;
      let imageArrays = [];
      let aryIndicesMode1 = [];
      let aryIndicesMode2 = [];
      let aryIndicesMode3 = {
      'noBarcode': []
      };
      Dynamsoft.Lib.showMask();
      ReadBarcode(0);
      function ReadBarcode(i) {
        var j, sImageIndex = i,
        bBarcodeFound = false,
        strSelectedMode = self.select.val;
        if (sImageIndex == self.DWObject1.HowManyImagesInBuffer) return;
        if (self.dbrObject) {
          var settings = self.dbrObject.getRuntimeSettings();
          settings.mBarcodeFormatIds = 503317503;
          self.dbrObject.updateRuntimeSettings(settings);
          self.DWObject1.CurrentImageIndexInBuffer = sImageIndex;
          var barcodeImage = self.DWObject1.GetImageURL(sImageIndex, -1, -1);
          self.dbrObject.decode(barcodeImage).then(function (results) {
            ProcssedImagesCount++;
            if (results.length == 0) {
              console.log("No barcode found on image " + (sImageIndex + 1));
              if (bBarcodeFound == true) {
                bBarcodeFound = false;
                aryIndicesMode1[aryIndicesMode1.length - 1].push(sImageIndex);
                if (aryIndicesMode2.length == 0)
                  aryIndicesMode2.push([sImageIndex]);
                else
                  aryIndicesMode2[aryIndicesMode2.length - 1].push(sImageIndex);
              } 
              else {
                if (aryIndicesMode1.length == 0)
                  aryIndicesMode1.push([sImageIndex]);
                else
                  aryIndicesMode1[aryIndicesMode1.length - 1].push(sImageIndex);
                if (aryIndicesMode2.length == 0)
                  aryIndicesMode2.push([sImageIndex]);
                else
                 aryIndicesMode2[aryIndicesMode2.length - 1].push(sImageIndex);
              } 
              aryIndicesMode3.noBarcode.push(sImageIndex);
            } 
            else {
              bBarcodeFound = true;
              console.log("Barcode found on image " + (sImageIndex + 1));
              aryIndicesMode1.push([sImageIndex]);
              if (aryIndicesMode2.length == 0)
                aryIndicesMode2.push([]);
              else if (aryIndicesMode2[aryIndicesMode2.length - 1].length != 0)
                aryIndicesMode2.push([]);
              var barcodeOnThisImage = [],
              allKeys = [];
              for (j = 0; j < results.length; j++) {
                var result = results[j];
                var barcodeText = result.BarcodeText;
                if (barcodeOnThisImage.indexOf(barcodeText) == -1)
                  barcodeOnThisImage.push(barcodeText);
                console.log("The content for barcode number " + (j + 1) + " is: " + barcodeText);
                var imageArray = {
                  index: sImageIndex,
                  text: barcodeText
                };
                imageArrays.push(imageArray);
              }
              
              Dynamsoft.Lib.each(aryIndicesMode3, function (value, key) {
                allKeys.push(key);
              });
              for (j = 0; j < allKeys.length; j++) {
                var oKey = allKeys[j];
                if (barcodeOnThisImage.indexOf(oKey) != -1) {
                  barcodeOnThisImage.splice(barcodeOnThisImage.indexOf(oKey), 1);
                  var _value = aryIndicesMode3[oKey];
                  if (_value.indexOf(sImageIndex) == -1) {
                    _value.push(sImageIndex);
                    aryIndicesMode3[oKey] = _value;
                  }
                }
              } 
              for (j = 0; j < barcodeOnThisImage.length; j++) {
                aryIndicesMode3[barcodeOnThisImage[j]] = [sImageIndex];
              }
            } 
            if (ProcssedImagesCount == self.DWObject1.HowManyImagesInBuffer) {
              ProcssedImagesCount = 0;
              var aryTemp = [];
              Dynamsoft.Lib.each(aryIndicesMode3, function (value, key) {
                aryTemp.push(value);
              });
              aryIndicesMode3 = aryTemp;
              Dynamsoft.Lib.hideMask();
              switch (strSelectedMode) {
                case 'mode1':
                  self.nameArr = imageArrays;
                  self.arrayArr = aryIndicesMode1;
                  self.prompt();
                  self.getDocumentData();
                break;
                case 'mode2':
                  self.nameArr = imageArrays;
                  self.arrayArr = aryIndicesMode2;
                  self.prompt();
                  self.getDocumentData();
                break;
                case 'mode3':
                  self.nameArr = imageArrays;
                  self.arrayArr = aryIndicesMode3;
                  self.prompt();
                  self.getDocumentData();
                break;        
              }
            } 
            // Read the next image
            ReadBarcode(sImageIndex + 1);
          }, 
          function (ex) {
            console.log("Error reading barcode: " + ex.message);
            Dynamsoft.Lib.hideMask();
          });
        }
      }
    },
    optionalAsyncSuccessFunc(){
      console.log('success');
    },
    optionalAsyncFailureFunc(){
      console.log('fail');
    }, 
    ShowImage(){
      if(this.file.value == '' || this.file.value == undefined || this.file.value == null){
        this.msg = '';
        this.msg = 'Please select document from dropdown menu...';
        this.snackbar = true;
        return;
      }
      this.DWObject1.SetHTTPHeader('Authorization','Basic ' + btoa(sessionStorage.getItem('id')));
      this.DWObject1.HTTPDownload(this.baseURL,'alfresco/versions/1/nodes/'+this.file.value+'/content?attachment=true',
       this.optionalAsyncSuccessFunc,
       this.optionalAsyncFailureFunc);
    },  
    AcquireImage() {
      var self = this;
      if (self.DWObject1) {
        self.DWObject1.SelectSource();
        self.DWObject1.OpenSource();
        self.DWObject1.Resolution = 300;
        //this.DWObject.PixelType = EnumDWT_PixelType.TWPT_GRAY;  
        self.DWObject1.IfShowUI = false;
        var OnAcquireImageSuccess = function (){console.log('success');};
        var OnAcquireImageFailure = function (){console.log('fail') };
        self.DWObject1.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
        self.DWObject1.CloseSource();
      }
    },
    LoadImages() {
      var self = this;
      if (self.DWObject1) {
        self.DWObject1.LoadImageEx('', 5,
          function () {
          },
          function (errorCode, errorString) {
            console.log('Failed to load a file with the error code:' + errorString);
          }
        );
      }
    },
    RemoveImages() {
      var self = this;
      if (self.DWObject1)
      self.DWObject1.RemoveAllSelectedImages();
    }    
  }
}
</script>

<style scoped>
    .btn{
        width:90%;
    }
</style>
