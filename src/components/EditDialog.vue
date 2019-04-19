<template>
 <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
  >

        <v-tabs
        v-model="active"
        color="primary"
        dark
        slider-color="yellow"
      >
        <v-tab
          v-for="(contact,n) in contacts"
          :key="n"
          ripple
        >
           {{ contact.name }}
        </v-tab>
        <v-spacer></v-spacer>
        <v-icon style="cursor:pointer;" @click="closeDialog" class="mr-1">cancel</v-icon>
        <v-tab-item
          v-for="(contact,n) in contacts"
          :key="n"
        >
          <v-card flat class="justify-center px-5" background-color="black">
            <v-card-title primary-title class="justify-center">
              <v-icon>person</v-icon>
                <h3>Name: {{ contact.name }} </h3>

            </v-card-title>

            <v-text-field
              prepend-inner-icon="edit"
              name="name"
              :label="`Change name: ${contact.name}`"
              v-model="name"
            ></v-text-field>

              <v-text-field
                prepend-inner-icon="how_to_reg"
                name="name"
                :label="`Change status: ${contact.status}`"
                v-model="status"
              ></v-text-field>

              <v-text-field
                prepend-inner-icon="edit"
                name="name"
                :label="`Change number: ${contact.desc}`"
                v-model="number"
              ></v-text-field>

            <div class="text-xs-center">
              <v-btn color="info" v-if="contact.status==0 || contact.status==2">Edit</v-btn>
              <v-btn color="primary" @click="edit(contact.id)">Confirm</v-btn>
              <v-btn color="error" v-if="contact.status==0">Delete</v-btn>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>
  </v-dialog>
</template>

<script>
export default {
  methods:{
    edit(id){
      // CHANGING USER DATA
      axios.put('http://739k121.mars-e1.mars-hosting.com/fadata/editUser',{

          id:id,
          name:this.name,
          status:this.status,
          number:this.number

      }).then(response=>{
        // IF SUCCESS, CLEAR VARIABLES AND EMIT TO PARENT COMPONENT
        if(response.data.status=="success"){
          this.name = '';
          this.status = '';
          this.number = '';
          this.closeDialog();
          this.$emit('refresh');
        }
      })
    },
    closeDialog(){
      // EMIT TO PARENT COMPONENT TO CLOSE POPUP
      this.$emit('closeDialog');
    }
  },
  props:{
    contacts: Array,
    dialog: Boolean
  },
  data(){
    return{
      active: null,
      name:'',
      status:'',
      number:''
    }
  }
}
</script>

<style scoped>
</style>
