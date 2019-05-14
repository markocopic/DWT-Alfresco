var app = require('express')();
var server = require('http').Server(app)

var io = require('socket.io')(server)

var axios = require('axios');

var users = names = {}

var proc = false;

server.listen(3000)
console.log('listening 3000');


// io.on('invite', function(pers, ch){
//     var person = { name:pers, channel:ch}
//     console.log(person);
    
//     io.emit('invite', person);
// })


io.on('connection', function(socket){

    


    // user[0] = channel
    // user[1] = id 
    // user[2] = name
    // user[3] = session ticket
    socket.on('join', function(user){

        socket.on('invite', function(pers, ch, user){
            var person = { name:pers, channel:ch, host:user}
            console.log(person);
            
            io.emit('invite', person);
        })

       socket.userId = user[1];
       socket.userName = user[2];
       
       users[user[1]] = socket;

       names[user[1]] = {
           'name': user[2],
           'socketId': socket.id
       }

       function updateNames(){
           io.emit('participants.' + user[0], names);
       }

       updateNames();

       getChat(user);


       var msg = [user[0],'SYSTEM',user[2]+' joined channel',user[3], new Date().toLocaleString()];
       postMessage(msg);

       
       socket.on('chat', function(payload){

                postMessage(payload);
            

       })

       socket.on('leave', function(user){
        var msg = [user[0],'SYSTEM',user[2]+' left channel',user[3], new Date().toLocaleString()];
        postMessage(msg);
            
            

            delete users[user[1]];
            delete names[user[1]];


            updateNames();
        })
    })

})

function postMessage(payload){
    console.log(proc);
    if(proc == true){
        console.log('STOP');
        return; 
    }
    proc = true;
    
    let param = "cm:name:" + payload[0];
    

    // checking if there is already JSON file with that name
     axios.post('http://35.204.234.73/alfresco/api/-default-/public/search/versions/1/search',
         {
           "query":{
             "query":param
           }
         },
         {
           headers:{
             Authorization: 'Basic ' + payload[3]
           }
       }).then(response =>{
        //console.log(response.data.list.entries.length>0);
        //console.log(response.data.list.entries.length);
        
        if(response.data.list.entries.length<1){
            createChat(payload);
        }
        else{
            var id = response.data.list.entries[0].entry.id;
            updateChat(payload,id); 
        }
               
       }).catch(err => {
         console.log(err);
       })
    
}

function updateChat(payload,id){
    //console.log('updating');

    axios.get('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id+'/content',
         
         {
            headers:{
                Authorization: 'Basic ' + payload[3]
            }
       }).then(response =>{
           let arr = response.data;
          
          
          let result = {name:payload[1], text:payload[2], time:new Date().toLocaleString()}
          if(arr.length>0){
            arr.push(result);
          }else{
              arr = [result];
          }
          

          axios.put('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id+'/content?majorVersion=false',
              JSON.stringify(arr),
              {
                headers:{
                  Authorization: 'Basic ' + payload[3]
                }
            }).then(response => {
              //console.log(response);
              io.emit('chat.' + payload[0], payload);
              proc = false;
            }).catch(err => {
              console.log(err);
            })
          
       })


       axios.get('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id,
         
         {
            headers:{
                Authorization: 'Basic ' + payload[3]
            },
            include: ["properties"]
       }).then(response =>{
           let arr = '';
          let res = response.data.entry.properties['cm:description'].split(',');
          console.log(payload[1]);
          for (let i = 0; i < res.length-1; i++) {
              if(res[i] == payload[1])
                return;
            arr += res[i] + ',';
          }
          arr += payload[1] + ',';
          console.log(arr);
          
          axios.put('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id,
         
          {   "properties":
            {
            "cm:description":arr
            }
          },{
          headers:{
              Authorization: 'Basic ' + payload[3]
          }
          
                      
                }).then(response =>{

                }).catch(err => {
                console.log(err);
            })
          
       }).catch(err => {
        console.log(err);
      })
    
}

function createChat(payload){
    //console.log('creating');
    
    let obj = {}
        obj.name = payload[0];
        obj.nodeType = "cm:content";
        obj.properties = { "cm:description":payload[1]+',' }
          
        axios.post('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/45dbad81-e657-4020-9266-e09dc597c25f/children?autoRename=true',
          JSON.stringify(obj),
          {
            headers:{
                Authorization: 'Basic ' + payload[3]
            }
        }).then(response => {
          let result = [
            {name:payload[1], text:payload[2], time:new Date().toLocaleString()}
          ]
          
          let id = response.data.entry.id;
          
            axios.put('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id+'/content?majorVersion=false',
              JSON.stringify(result),
              {
                headers:{
                  Authorization: 'Basic ' + payload[3]
                }
            }).then(response => {
              //console.log(response);
              setTimeout(() => {
                io.emit('chat.' + payload[0], payload);
                console.log(payload[0]);
                
              }, 7000);
              proc = false;
            }).catch(err => {
              console.log(err);
            })
      })


}

function getChat(user){
    let param = "cm:name:" + user[0];

    axios.post('http://35.204.234.73/alfresco/api/-default-/public/search/versions/1/search',
         {
           "query":{
             "query":param
           }
         },
         {
           headers:{
             Authorization: 'Basic ' + user[3]
           }
       }).then(response =>{
           if(response.data.list.entries.length>0){
                var id = response.data.list.entries[0].entry.id;
                //console.log(id) 

                axios.get('http://35.204.234.73/alfresco/api/-default-/public/alfresco/versions/1/nodes/'+id+'/content',
                    {
                        headers:{
                            Authorization: 'Basic ' + user[3]
                        }
                }).then(response =>{
                    //console.log(response.data);
                    io.emit('prevchat.' + user[0], response.data);
                }).catch(err => {
                    console.log(err);
                })
           }
       }).catch(err => {
         console.log(err);
       })

}