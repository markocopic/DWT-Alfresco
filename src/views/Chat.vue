<template>
    <v-container>
        <div id="chat" style="background:white; text-align:center;">

            <v-select
                style="width:300px;"
                :items="chatList"
                v-model="chat"
                label="select chat"
                class="d-inline-block pa-1"
            ></v-select>
            <v-btn class="d-inline-block" color="success" @click="openChat">open chat</v-btn>

            
            <v-select
                style="width:300px;"
                :items="peopleList"
                v-model="person"
                label="select person"
                class="d-inline-block pa-1"
            ></v-select>
            <v-btn class="d-inline-block" color="success" @click="invite">invite</v-btn>
            <v-btn class="d-inline-block" color="primary" @click="startNew('blank')">start new chat</v-btn>

            <v-text-field :disabled="disabled" style="width:300px;" class="pa-2 ma-2 d-inline-block" @keyup.enter="send" placeholder="enter text" v-model="message"></v-text-field>
            <v-btn :loading="disabled" class="d-inline-block" color="success" @click="send">send</v-btn>


            <ul>
                <h1 style="color:white;">Channel: {{channel}}</h1>
                <li class="listItem" :class="msg.id=='SYSTEM'?'neutral':msg.id==userName?'greens':'yellows'" v-for="(msg,i) in messages" :key="i">
                    <p style="font-size:9px;margin:5px 0 0;">{{ msg.time }}</p>
                    <h2 class="mt-0">{{ msg.id }} </h2>
                    <p>{{ msg.text }}</p><hr class="grey">
                </li>
            </ul>
            
        </div>
    </v-container>
  
</template>

<script>

export default {
    watch:{
        '$route' (to, from){
            this.messages = [];
           this.channel = to.params.id;
           this.loadNewChat();
        }
    },
    data(){
        return{
            messages:[],
            message:null,
            userName: sessionStorage.getItem('name'),
            userId: sessionStorage.getItem('id'),
            channel:'',
            participants:{},
            disabled:false,
            baseURL: this.$store.state.baseURL,
            peopleList:[],
            person:null,
            chatList:[],
            chat:null
        }
    },
    beforeDestroy(){
        let payload = [this.channel, this.userId, this.userName, btoa(sessionStorage.getItem('id'))];
        
        socket.emit('leave',payload);

        
    },
    mounted(){
        this.channel = this.$route.params.id;
        this.loadNewChat();
    },
    methods:{
        openChat(){
            if(this.chat)
                this.startNew(this.chat);
        },
        startNew(chat){
            let self = this;

            let user = [this.channel, this.userId, this.userName, btoa(sessionStorage.getItem('id'))];
        
            
            if(chat != 'blank'){
                this.channel = chat;
            }else{
                //socket.emit('leave',user);
                this.channel += Math.ceil(Math.random()*100);
            }
            
            this.messages = [];

            let payload = [this.channel, this.userId, this.userName, btoa(sessionStorage.getItem('id'))];

            socket.emit('join',payload);


            socket.on('chat.' + self.channel, function(payload){
                //console.log(payload);
                let obj = {};
                obj.id = payload[1];
                obj.text = payload[2];
                obj.time = payload[4];
                self.messages.unshift(obj);
                self.disabled = false;
                console.log('stop');
            })


            socket.on('prevchat.' + self.channel, function(payload){
                if(self.messages.length < 3){
                    for (let i = 0; i < payload.length; i++) {
                        let obj = {};
                        obj.id = payload[i].name;
                        obj.text = payload[i].text;
                        obj.time = payload[i].time;
                        self.messages.unshift(obj)
                    }
                }
            })
        },
        invite(){
            if(this.person){
                console.log('q');
                
                socket.emit('invite', this.person,this.channel, this.userName);
            }
        },
        send(){
            if(!this.message || this.message.trim() == '') {
               this.message = null; 
               return;
            }
            this.disabled = true;
            let payload = [this.channel, this.userName, this.message, btoa(sessionStorage.getItem('id')), new Date().toLocaleString()];

            socket.emit('chat', payload);

            this.message = null;
        },
        loadNewChat(){
            let param = 'cm:description:' + sessionStorage.getItem('name')
        axios.post(this.baseURL + 'search/versions/1/search',
         {
           "query":{
             "query":param
           }
         },
         {
           headers:{
             Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
           }
       }).then(response =>{
           let list = response.data.list.entries;
           for (let i = 0; i < list.length; i++) {
              this.chatList.push(list[i].entry.name);
           }
           
       })

        axios.get(this.baseURL + 'alfresco/versions/1/people',{
          headers:{
                     Authorization: 'Basic ' + btoa(sessionStorage.getItem('id'))
                 }
        })
        .then(response => {
            this.peopleList = [];
         let list =  response.data.list.entries;
          for (let i = 0; i < list.length; i++) {
              this.peopleList.push(list[i].entry.id)
          }
          console.log(this.peopleList);
          
        })

        
        let self = this;

        let payload = [this.channel, this.userId, this.userName, btoa(sessionStorage.getItem('id'))];

        socket.emit('join',payload);

        socket.on('connect', function(){
            //socket.emit('join', payload);
            console.log('connected to server');
        })

        socket.on('chat.' + self.channel, function(payload){
            //console.log(payload);
            let obj = {};
            obj.id = payload[1];
            obj.text = payload[2];
            obj.time = payload[4];
            self.messages.unshift(obj);
            self.disabled = false;
            console.log('stop');
            
        })


        socket.on('prevchat.' + self.channel, function(payload){
            if(self.messages.length < 2){
                 for (let i = 0; i < payload.length; i++) {
                    let obj = {};
                    obj.id = payload[i].name;
                    obj.text = payload[i].text;
                    obj.time = payload[i].time;
                    self.messages.unshift(obj)
                }
            }
        })

        socket.on('participants.' + self.channel, function(payload){
            //console.log(payload);
            self.participants = payload;
            //console.log(self.participants);
            
            
        })
        }
    }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding:10px;
  background-color:black;
  height:70vh;
  overflow:auto;
}
.yellows{
    color:rgb(39, 131, 235);
    text-align: right;
}
.greens{
    color:rgb(4, 172, 4);
    text-align: left;
}
.neutral{
    color:rgb(219, 243, 219);
}
.listItem{
    background-color: black;
}
</style>
