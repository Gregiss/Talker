

const app = new Vue({
    el: "#app",
    data: {
        register: false,
        socket: null,
        formRe: {
            "user": "",
            "password": ""
        },
        formLo: {
            "user": "",
            "password": ""
        },
        erros: []
    },
    created(){
        this.socket = io('http://localhost:8000');
        this.connect();
    },
    methods: {
        connect(){
            console.log("Starting");
            this.socket.on('connect', function(){
                console.log("Conectado");
            })
            this.socket.emit('conectar', true);
            this.socket.on('conectado', function(token){
                localStorage.setItem("token", token);
                console.log(token);
            })
        },
        errosAlert(error){
            const id = this.erros.length;
                const erro = {id: id, "error": error, timer: 100}
                this.erros.push(erro)
                const timer = setInterval(() => {
                const idT = this.erros.indexOf(erro)
                this.erros[idT].timer -= 10
                if(this.erros[idT].timer <= 11){
                    clearInterval(timer);
                    this.erros.splice(idT, 1);
                }
            }, 300);
        },
        login(){
            if(this.formLo.user.length < 2 || this.formLo.password < 2){
                this.errosAlert("Preencha todos os campos");
            } else{
                this.errosAlert("Aguarde um momento");
            }
        },
        registrar(){
            if(this.formRe.user.length < 2 || this.formRe.password < 2){
                this.errosAlert("Preencha todos os campos");
            } else{
                this.errosAlert("Aguarde um momento");
            }
        }
    }
})

