<template>
    <div id="container" style="height: 100vh" class="d-flex flex-column justify-center align-center">
        <v-card elevation="0" style="width:20%;margin-top:260px">
            <v-form ref="formLogin">
            <v-card-title style="background-color:#2d64a5;color:white">SAFE PLACE - Panel Admin</v-card-title>
                <v-card-text class="d-flex flex-column justify-space-between mt-4">
                    <v-text-field class="my-4" :rules="[rules.required,rules.emailFormat]" v-model="emailUser" label="Mail" variant="outlined"></v-text-field>
                    <v-text-field
                        :rules="[rules.required]"
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        label="Mot de passe"
                        variant="outlined"
                    >
                    <template v-slot:append-inner>
                        <v-icon color="#2d64a5" @click="togglePasswordVisibility">
                            {{showPassword ? 'mdi-eye-off' : 'mdi-eye'}}
                        </v-icon>
                    </template>
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="login" color="white" style="width: 100%;background-color: #2d64a5;">Se Connecter</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>
<script setup>
import {ref} from "vue"
import { useRouter } from 'vue-router'
import {rules} from "@/utils/rules.js"
const formLogin = ref("");
const router = useRouter()
const password =  ref('');
const emailUser = ref('');
const showPassword =  ref(false);
function togglePasswordVisibility() {
        showPassword.value = !showPassword.value;
    }
async function login(){
    const {valid} = await formLogin.value.validate();
    if(valid){

        await fetch('http://localhost:8090/admin/login',{
            method:"POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                email:emailUser.value,
                password:password.value
            })
        }).then(async(res)=>{
            if (res.ok) {
                let data = await res.json();
                console.log(data);
                localStorage.setItem('jwt',data.jwt)
                router.push({name:"AdminBoard"})
            }else{
                alert('identifiants incorrects !')
            }
                
        })
    }
}
</script>
<style lang="css" scoped>
#container{
    background:url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    /* background-color:#e7e7e7 */
}
</style>