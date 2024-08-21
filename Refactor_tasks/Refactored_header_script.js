class Domcontentloaded{

    constructor() {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }

    initialize() {
        this.domCreate();
        this.startTimer();
    }

    domCreate(){
        this.popup = document.createElement("div");
        this.popup.classList.add("popup");
        this.popup.innerHTML = `
        <h1>Welcome the odin library!</h1>`;
        this.popup.style.color = "white";
        document.getElementById("header").appendChild(this.popup);
    }
    
    startTimer() {
        setTimeout(() => this.onTimeout(), 6000);
    }


    onTimeout() {
        this.popup.style.display = "none";
        document.querySelector(".main-content").style.display = "block";
        document.body.style.backgroundColor = 'rgb(180, 180, 180)'
    }
}

new  Domcontentloaded();