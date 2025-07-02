const stompClient = new StompJs.Client({
    brokerURL: 'ws://' + window.location.host + '/quickchat-websocket'
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
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    stompClient.publish({
        destination: "/app/new-message",
        body: JSON.stringify({'user': $("#user").val(), 'message': $("#message").val()})
    });
    $("#message").val("");
}

function updateLiveChat(message) {
    const chatWindow = $("#chat-window");
    const messageBubble = $("<div>").addClass("message-bubble").text(message);

    chatWindow.append(messageBubble);

    chatWindow.scrollTop(chatWindow[0].scrollHeight);
}

$(function () {
    $("#connect-section form").on('submit', (e) => e.preventDefault());

    $("#message-form").on('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });

    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
});