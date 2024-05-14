    document.addEventListener('DOMContentLoaded', () => {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
        <h1>Welcome the odin library!</h1>`;
        popup.style.color = "white";
        document.getElementById("header").appendChild(popup);
        
        // Hide the popup after 4 seconds
        setTimeout(() => {
            popup.style.display = "none";
            document.querySelector(".main-content").style.display = "block";
            document.body.style.backgroundColor = 'rgb(180, 180, 180)'
        }, 6000);
    });

