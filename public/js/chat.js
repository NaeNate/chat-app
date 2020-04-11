const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");


const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const autoScroll = () => {
  // new message
  const $newMessage = $messages.lastElementChild

  //height of new message
  const $newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt($newMessageStyles.marginBottom)
  const newMessegeHeight = $newMessage.offsetHeight + newMessageMargin
  
  //
  const visibleHeight = $messages.offsetHeight

  //hieght message container
  const containerHeight = $messages.scrollHeight

  //HOe far scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessegeHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: capitalizeFirstLetter(message.username),
    message: message.text,
    createdAt: moment(message.createdAt).format("MMM D, h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll()
});

socket.on("loacationMessage", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    username: capitalizeFirstLetter(location.username),
    location: location.url,
    createdAt: moment(location.createdAt).format("MMM D, h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll()
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("Message sent");
  });
});

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $locationButton.removeAttribute("disabled");
        console.log("location shared");
      }
    );
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})

document.querySelector('#joinButton').addEventListener('click', () => {
  user.room = 'Family'
})