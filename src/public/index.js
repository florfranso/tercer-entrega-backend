//captura el valor del email del usuario
let user;
Swal.fire({
    title:"Hola usuario",
    text:"bienvenido, ingresa tu usario",
    input:"text",
    customClass: {
        validationMessage: 'my-validation-message'
    },
    preConfirm: (value) => {
        if (!value) {
            Swal.showValidationMessage(
                '<i class="fa fa-info-circle"></i>Nombre obligatorio'
            )
        }
    },
    allowOutsideClick:false
}).then(respuesta=>{
    user = respuesta.value;
    document.getElementById("userEmail").innerHTML = `<strong>Bienvenido ${respuesta.value}!!</strong>`;
});

//**************//
//envio del formulario
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    const product= {
        title:document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    productForm.reset();
})


//**************//
//productos en tiempo real
const createTable = async(data)=>{
    const response = await fetch("./template/table.handlebars");
    const result = await response.text();
    const template = Handlebars.compile(result);
    const html = template({products:data});
    return html;
}

socketClient.on("products",async(data)=>{
    const htmlTable = await createTable(data);
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = htmlTable;
})


//**************//
//chat
socketClient.on("messages",async (dataMsg)=>{
    let messageElements = "";
    dataMsg.forEach(msg=>{
        messageElements += `<div><strong>${msg.user} - ${msg.timestamp}:</strong> ${msg.message}</div>`;
    })
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = dataMsg.length>0 ? messageElements : '';
})

//envio del mensaje del chat
const chatInput = document.getElementById("chatMsg");
const chatButton = document.getElementById("sendMsg");

chatButton.addEventListener("click",()=>{
    socketClient.emit("newMessage",{
        user:user,
        timestamp: new Date().toLocaleString(),
        message: chatInput.value
    });
    chatInput.value = "";
})

/*const socket = io.connect();

function render(data) {
    const html = data
        .map((elem, index) => {
            return `<div style='text-align: center; background-color: lightblue'>
        <strong style='color: blue'>${elem.email}</strong>
        [<span style='color: brown'>${elem.time}</span>]:
        <i style='color: green'>${elem.text}</i>
        </div>`;
        })
        .join(" ");
    document.getElementById("messages").innerHTML = html;
}

socket.on("messages", data => {
    render(data);
});

function addMessage(e) {
    const message = {
        email: document.getElementById("email").value,
        text: document.getElementById("text").value,
    };
    if (!message.email) {
        alert(
            "Por favor, introduzca un email para mandar un mensaje en el chat"
        );
    } else {
        socket.emit("new-message", message);
        console.log('nuevo mensaje');

    }

    return false;
}

function addProduct(e) {
    console.log('se agrego el producto');
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
    };
    if (!product.title) {
        alert("Por favor, introduzca el nombre del producto");
    } else if (!product.price) {
        alert("Por favor, introduzca el precio del producto");
    } else if (!product.thumbnail) {
        alert("Por favor, introduzca el link con la imagen del producto");
    } else {
        socket.emit("new-product", product);
    }

    return false;
}*/