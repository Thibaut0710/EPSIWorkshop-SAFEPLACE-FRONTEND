<template>
    <v-toolbar color="indigo-darken-4">
    <template v-slot:prepend>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn @click="filtreList('pending')" width="50%" variant="text">Pending</v-btn>
        
                <v-divider vertical></v-divider>
        
                <v-btn @click="filtreList('TBF')" width="50%"  variant="text">TBF</v-btn>
        
                <v-divider vertical></v-divider>
        
                <v-btn @click="filtreList('approved')" width="50%"  variant="text">Approved</v-btn>
                <v-divider vertical></v-divider>
            </v-toolbar-items>
    </template>
    <v-divider vertical></v-divider>
    <div class="mx-4">
        <v-avatar>
            <v-img
                alt="John"
                src="https://cdn.vuetifyjs.com/images/john.jpg"
            ></v-img>
        </v-avatar>
        <v-btn width="50%"  variant="text">Jhon</v-btn>
    </div>
    </v-toolbar>
    <div class="d-flex flex-row">
        <v-card style="border:1px solid;border-radius: 0px;" width="458" height="93vh">
            <v-card-text class="d-flex flex-column  justify-center align-items-center pa-4">
                <v-btn @click="selectTicket(item)" variant="text" class="text-center pa-2 my-1" style="border:1px solid black" v-for="item in listFiltre">Ticket #{{ item.id }}</v-btn>
            </v-card-text>
        </v-card>
        <div v-if="!!ticketSelected" style="width: 80%;" class="d-flex flex-column align-center justify-center">
            <v-card variant="outlined" max-height="max-content" class="ma-4 mt-0 mb-15" width="700">
                <v-card-title style="background-color:#1A237E; color:white">Site : 
                    <v-tooltip location="top" v-if="ticketSelected.url.length > 20" :text="ticketSelected.url">
                        <template v-slot:activator="{ props }">
                            <span class="mr-2" v-bind="props">{{ ticketSelected.url.substring(0,20) }}...</span>
                        </template>
                    </v-tooltip>
                    <span v-else>{{ ticketSelected.url }}</span>
                     - Signalement Ticket #{{ ticketSelected.id }}</v-card-title>
                <v-card-text class="ma-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!
                </v-card-text>
                <v-divider :thickness="3" class="ma-4"></v-divider>
                <v-card-text class="ma-4 pt-0">
                    <span style="font-weight: 600;">Commentaire du signalement</span>
                    <p class="mt-4">{{ ticketSelected.comment }}</p>
                </v-card-text>
                <!-- <v-divider :thickness="2" class="ma-4"></v-divider> -->
                <v-card-actions class="d-flex flex-column" style="width: 100%;">
                    <div v-if="ticketSelected.status != 'TBF' && ticketSelected.status != 'approved'" class="d-flex flex-row justify-end mb-4">
                        <v-btn @click="goToTBF(ticketSelected.id)" variant="outlined" class="mr-4" color="green">Approve</v-btn>
                        <v-btn variant="outlined" color="red">Reject</v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </div>
    </div>
    <v-btn @click="dialog = true">
      Open Dialog
    </v-btn>

    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        width="780"
        height="450"
        class="pa-8"
      >
        <v-card-title style="font-weight: 700;">Report Content
            <v-icon @click="dialog = false" style="position: absolute; top: 10px; right: 10px;cursor: pointer;">mdi-close</v-icon>
        </v-card-title>
      <v-card-text class="pt-0 pl-4">
        <span>Thank you for your report.</span>
        <p class="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet numquam dicta officia, suscipit velit asperiores quidem esse recusandae, corrupti iusto earum, animi sit molestias cupiditate eos! Aperiam veniam eligendi cumque?</p>
        <v-textarea v-model="commentaireTicket" hide-details class="mt-8" rows="1" auto-grow variant="outlined" label="ajoutez un commentaire"></v-textarea>
        <v-checkbox hide-details label="Block content"></v-checkbox>
        <!-- <v-checkbox
            color="red"
            label="red"
            value="red"
            hide-details
          ></v-checkbox> -->
    </v-card-text>
    <v-card-actions>
        <v-btn @click="dialog = false" variant="outlined">Annuler</v-btn>
        <v-btn @click="createTicket()" style="background-color: #4F4F4F;" color="white">Confirmer</v-btn>
    </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script setup>
import { onMounted } from "vue";
import { watch } from "vue";
import { reactive } from "vue";
import { ref } from "vue"
let list = reactive([
    {id:1,url:"https://x.com/arianajasmine__/status/1845900284477735214",comment:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!",status:"pending",content:""},
    {id:2,url:"Instagram",comment:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!",status:"pending",content:""},
    {id:3,url:"Facebook",comment:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!",status:"pending",content:""},
    {id:4,url:"Telegram",comment:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!",status:"approved",content:""}
])

const commentaireTicket = ref('');
const listFiltre = ref([]);
const dialog = ref(false);
const ticketSelected = ref(null)

function selectTicket(item){
    ticketSelected.value = {...item}
    console.log(ticketSelected)
}

function filtreList(filtre){
    listFiltre.value =  [...list.filter(item=>item.status == filtre)]
    console.log(listFiltre.value)
    }

function createTicket(){
    list.push({
        id:5,
        url:'Test',
        comment:commentaireTicket.value,
        status:"pending",
        content:""
    })
    dialog.value = false;
    filtreList("pending")
}

function goToTBF(id){
    let elementToTBF = list.find(ticket => ticket.id == id)
    console.log(elementToTBF)
    elementToTBF.status = "TBF"
    ticketSelected.value = {...elementToTBF}
    filtreList('TBF')
}

onMounted(()=>{
    filtreList('pending')
    console.log(listFiltre.value)
})
</script>