<template>
    <v-toolbar color="#2d64a5">
    <template v-slot:prepend>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn @click="filtreList('pending')" width="50%" variant="text">En Attentes</v-btn>
        
                <v-divider vertical></v-divider>
        
                <v-btn @click="filtreList('tbf')" width="50%"  variant="text">TBF</v-btn>
        
                <v-divider vertical></v-divider>
        
                <v-btn @click="filtreList('approved')" width="50%"  variant="text">Validés</v-btn>
                <v-divider vertical></v-divider>
                <v-btn @click="dialog = true">
                Création Ticket
                </v-btn>

                <v-dialog
                v-model="dialog"
                width="auto"
                >
                <v-card
                    width="780"
                    class="pa-4"
                >
                <v-form ref="formCreateTicket">
                    <v-card-title class="mx-3" style="font-weight: 700;">Création d'un Ticket
                        <v-icon @click="dialog = false" style="position: absolute; top: 10px; right: 10px;cursor: pointer;">mdi-close</v-icon>
                    </v-card-title>
                    <v-card-text class="pt-0 pl-4">
                    <span class="mx-3">Thank you for your report.</span>
                    <p class="mt-4 mx-3" style="text-align:justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet numquam dicta officia, suscipit velit asperiores quidem esse recusandae, corrupti iusto earum, animi sit molestias cupiditate eos! Aperiam veniam eligendi cumque?</p>
                    <v-textarea :rules="[rules.required]" v-model="commentaireTicket" hide-details="auto" class="mt-8 mx-3" rows="1" auto-grow variant="outlined" label="ajoutez un commentaire"></v-textarea>
                    <v-checkbox :rules="[rules.required]" v-model="blockContent" hide-details="auto" label="Bloquer le contenu"></v-checkbox>
                </v-card-text>
                </v-form>
                <v-card-actions>
                    <v-btn @click="dialog = false" variant="outlined">Annuler</v-btn>
                    <v-btn :disabled="blockContent == false" @click="createTicket()" style="background-color: #4F4F4F;" color="white">Confirmer</v-btn>
                </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar-items>
    </template>
    <v-divider vertical></v-divider>
    <div class="mx-4">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-avatar style="cursor:pointer" v-bind="props">
            <v-img
                alt="John"
                src="https://cdn.vuetifyjs.com/images/john.jpg"
            ></v-img>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Se Déconnecter</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
        
    </div>
    </v-toolbar>
    <div class="d-flex flex-row">
        <v-card style="border:1px solid;border-radius: 0px;" width="465" height="93vh">
            <v-card-text class="d-flex flex-column  justify-center align-items-center pa-2">
                <v-btn @click="selectTicket(item)" variant="text" class="text-center pa-2 my-1" style="border:1px solid black" v-for="item in listFiltre">Ticket #{{ item._id }}</v-btn>
            </v-card-text>
        </v-card>
        <div v-if="!!ticketSelected" style="width: 75%;" class="d-flex flex-column align-center justify-center">
            <v-card variant="outlined" max-height="max-content" class="ma-4 mt-0 mb-15" width="700">
                <v-card-title style="background-color:#2d64a5; color:white">Site : 
                    <v-tooltip location="top" v-if="ticketSelected.url.length > 20" :text="ticketSelected.url">
                        <template v-slot:activator="{ props }">
                            <span class="mr-2" v-bind="props">{{ ticketSelected.url.substring(0,20) }}...</span>
                        </template>
                    </v-tooltip>
                    <span v-else>{{ ticketSelected.url }}</span>
                     - Signalement Ticket #{{ ticketSelected._id }}</v-card-title>
                <v-card-text class="ma-4" style="text-align:justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque error recusandae, deserunt neque voluptatem, veritatis maxime sequi dolore hic debitis repellat veniam eveniet impedit! Incidunt hic animi amet quasi a!
                </v-card-text>
                <v-divider :thickness="3" class="ma-4"></v-divider>
                <v-card-text class="ma-4 pt-0">
                    <span style="font-weight: 600;">Commentaire du signalement</span>
                    <p class="mt-4">{{ ticketSelected.comment }}</p>
                </v-card-text>
                <!-- <v-divider :thickness="2" class="ma-4"></v-divider> -->
                <v-card-actions class="d-flex flex-column" style="width: 100%;">
                    <div v-if="ticketSelected.status != 'approved'" class="d-flex flex-row justify-end mb-4">
                        <v-btn v-if="ticketSelected.status == 'pending'" @click="changeStatus(ticketSelected._id,'pending')" variant="outlined" class="mr-4" color="green">Signaler</v-btn>
                        <v-btn v-if="ticketSelected.status == 'tbf'" @click="changeStatus(ticketSelected._id,'tbf')" variant="outlined" class="mr-4" color="green">Valider</v-btn>
                        <v-btn variant="outlined" color="red">Refuser</v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </div>
    </div>
    <v-alert
    v-if="!!messageAlert"
    :text="messageAlert"
    title="Création Ticket"
    type="success"
  ></v-alert>
</template>
<script setup>
import { onMounted } from "vue";
import { watch } from "vue";
import { reactive } from "vue";
import { ref } from "vue"
import { useRouter } from 'vue-router'
import {rules} from "@/utils/rules.js"


const router = useRouter()
let list = reactive([])
const jwt = ref(localStorage.getItem('jwt'))
const formCreateTicket = ref(false);
const blockContent = ref(false);
const commentaireTicket = ref('');
const listFiltre = ref([]);
const dialog = ref(false);
const ticketSelected = ref(null)
const messageAlert = ref("")

async function selectTicket(item){
    console.log(item._id)
    await fetch("http://localhost:8090/report/"+item._id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        }
        })
        .then(async(res)=>{
            console.log(res)
            const data = await res.json(); 
            console.log(data)
            ticketSelected.value = data.report

        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function filtreList(filtre){
    listFiltre.value =  [...list.filter(item=>item.status == filtre)]
    console.log(listFiltre.value)
    }

async function createTicket(){
    const { valid } = await formCreateTicket.value.validate()
    let body = JSON.stringify({
            fields: {
            content: "ici",
            comment: commentaireTicket.value,
            url: 'https://x.com/home',
        }
    });
    console.log(body)
    if(valid){
        await fetch("http://localhost:8090/report/", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: body
        })
        .then(async (res) => {
            
            const data = await res.json(); 
            console.log(data)
            messageAlert.value = data.message;
            await getAllReport();
            dialog.value = false;
            formCreateTicket.value.resetForm();
            
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
    // list.push({
    //     id:5,
    //     url:'Test',
    //     comment:commentaireTicket.value,
    //     status:"pending",
    //     content:""
    // })
    // dialog.value = false;
    // filtreList("pending")
}

async function changeStatus(id,category){
    let route = category == 'pending' ? 'forward' : 'approve';
    let element = listFiltre.value.find(ticket => ticket._id == id)
    console.log(element,"ici")
    await fetch(`http://localhost:8090/report/${route}/${element._id}`,{
        method:"PUT",
        headers: {
        'Authorization': `Bearer ${jwt.value}`, 
        'Content-Type': 'application/json',
        }
    }).then(async (res)=>{
        console.log(res)
        let data = await res.json();
        console.log(data)
        element.status = data.report.status;
        filtreList(category);
        ticketSelected.value = null;
    })
    // elementToTBF.status = "TBF"
    // ticketSelected.value = {...elementToTBF}
    // filtreList('TBF')
}

async function getAllReport(){
    await fetch("http://localhost:8090/report/", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        },
    })
    .then(async (res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok: ' + res.statusText);
        }
        
        const data = await res.json(); 
        list = [...data.reports]
        filtreList("pending")
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

async function logout(){
    await fetch(`http://localhost:8090/admin/logout`,{
        method:"POST",
        headers: {
        'Authorization': `Bearer ${jwt.value}`, 
        'Content-Type': 'application/json',
        }
    }).then(res=>{
        router.push({name:'Login'});
        localStorage.clear()
    })
}
onMounted(()=>{
    getAllReport()
})

</script>