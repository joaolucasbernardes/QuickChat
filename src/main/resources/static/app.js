const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const brokerURL = protocol + '//' + window.location.host + '/quickchat-websocket';

const stompClient = new StompJs.Client({
    brokerURL: brokerURL
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topics/quickchat', (message) => {
        updateLiveChat(JSON.parse(message.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#connect-section").hide();
        $("#chat-section").show();
    } else {
        $("#connect-section").show();
        $("#chat-section").hide();
    }
}

function connect() {
    const username = $("#user").val().trim();
    if (username) {
        stompClient.activate();
    } else {
        alert("Por favor, digite um nome de usuário para entrar no chat.");
    }
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    const messageContent = $("#message").val().trim();
    if (messageContent) {
        stompClient.publish({
            destination: "/app/new-message",
            body: JSON.stringify({'user': $("#user").val(), 'message': messageContent})
        });
        $("#message").val("");
    }
}


function updateLiveChat(message) {
    const chatWindow = $("#chat-window");
    const messageBubble = $("<div>").addClass("message-bubble").html(message);

    chatWindow.append(messageBubble);

    chatWindow.scrollTop(chatWindow[0].scrollHeight);
}

$(function () {
    $("#message-form").on('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });

    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
});