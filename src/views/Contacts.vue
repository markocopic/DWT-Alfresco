<template>
  <div class="contacts">
    <v-layout row wrap class="mt-5">
      <v-flex xs6 offset-xs3 class="mt-5">
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
      <v-tab-item
        v-for="(contact,n) in contacts"
        :key="n"
      >
        <v-card flat class="justify-center"  height="300px">
          <v-card-title primary-title class="justify-center">
              <h3> {{ contact.name }} </h3>
              <v-icon x-large>person</v-icon>
          </v-card-title>
          <v-card-text class="justify-center">{{ contact.desc }}</v-card-text>
          <div class="text-xs-center">
            <v-btn color="primary">Show</v-btn>
            <v-btn color="info" v-if="contact.status==0 || contact.status==2" @click="edit(contact.name)">Edit</v-btn>
            <v-btn color="error" v-if="contact.status==0">Delete</v-btn>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs>

    </v-flex>
    </v-layout>

    <!-- MODAL -->
    <v-dialog
       v-model="dialog"
       max-width="600px"
       min-height="600px"
       persistent
     >
      <v-layout row wrap>
        <v-flex>

          <v-form class="white">
            <v-text-field
              name="name"
              :label="person.name"
              id="id"
            ></v-text-field>
          </v-form>
        </v-flex>
      </v-layout>

     </v-dialog>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        person:{},
        dialog: false,
        active: null,
        contacts:[
          { name:'Marko',
            desc:'Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam libris qualisque, utroque quaestio accommodare no qui.',
            status:0
          },
          { name:'Nikola',
            desc:'Et percipit laboramus usu, no invidunt verterem nominati mel',
            status:1
          },
          { name:'Darko',
            desc:'Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae adipisci.',
            status:2
          }
        ],
        contactDetails:[
          { name:'Marko',
            lastname:'Copic',
            age:35
          },
          { name:'Nikola',
            lastname:'Rakic',
            age:42
          },
          { name:'Darko',
            lastname:'Peric',
            age:28
          }
        ]
      }
    },
    methods: {
      edit(name){

        for(var item in this.contacts){
          if(this.contacts[item].name==name){
            this.person = this.contacts[item];
          }
        }
        this.dialog = true;
      },
      next () {
        const active = parseInt(this.active)
        this.active = (active < 2 ? active + 1 : 0)
      }
    }
  }
</script>

<style>
</style>
