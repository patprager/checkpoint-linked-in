// load der userData in den contact-cards
// Toggle-Button Connection
// Close contact-cards & anügen dahinter
// generieren der contact-cards in js

let pendingConnections = 0;

function createContactCards(container, data) {
  const userContact = document.createElement("div");
  const contactCardsContainer = document.querySelector(".contact-cards");
  userContact.classList.add("contact-card");

  userContact.innerHTML = `
  <div class="user-background-container"> <button class="close-icon">
  X
</button> <img class="user-background-img" src="${data.backgroundImage}" />
  </div>
    <img class="user-img" src="${data.picture}" />
    <p class="contact-name">${data.name.title} ${data.name.first} ${data.name.last}</p>
    <p class="job-title">${data.title}</p>
    <p class="mutual-connections">${data.mutualConnections} mutual Connections</p>

    <button class="connect-button" data-clicked="0">
        Connect
    </button>
    
`;
  contactCardsContainer.appendChild(userContact);
}

function clickedConnectBtn(event) {
  const connectButton = event.target;
  const clicked = connectButton.dataset.clicked;

  if (clicked === "1") {
    connectButton.dataset.clicked = "0";
    connectButton.textContent = "Connect";
    pendingConnections--;
  } else {
    connectButton.dataset.clicked = "1";
    connectButton.textContent = "Pending";
    pendingConnections++;
  }
  if (pendingConnections < 0) pendingConnections = 0;
  localStorage.setItem("connections", pendingConnections);
  updateConnectionCounter();
}

function clickedCloseIcon(event) {
  const closeIcon = event.target;
  const closedUserCard = closeIcon.closest("#user-contact-card");

  closedUserCard.remove();

  fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=1")
    .then((response) => response.json())
    .then((date) => {
      const cards = document.querySelector("#contact-cards");

      data.forEach((oneContactCard) => {
        createContactCards(cards, oneContactCard);
      });

      refreshListeners();
    });
}

function refreshListeners() {
  document.querySelectorAll(".connect-button").forEach((connectBtn) => {
    connectBtn.removeEventListener("click", clickedConnectBtn);
    connectBtn.addEventListener("click", clickedConnectBtn);
  });

  document.querySelectorAll(".close-icon").forEach((closeIcon) => {
    closeIcon.removeEventListener("click", clickedCloseIcon);
    closeIcon.addEventListener("click", clickedCloseIcon);
  });
}

function updateConnectionCounter() {
  const connectElement = document.getElementById("connections");

  if (pendingConnections === 0) {
    connectElement.textContent = "No pending invitations";
  } else if (pendingConnections === 1) {
    connectElement.textContent = "1 pending invitations";
  } else {
    connectElement.textContent = `${pendingConnections} pending invitations`;
  }
}

window.addEventListener("load", function () {
  pendingConnections = Number(this.localStorage.getItem("connections")) || 0;
  updateConnectionCounter();

  fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=8")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const cards = document.querySelector("#contact-cards");

      data.forEach((oneContactCard) => {
        createContactCards(cards, oneContactCard);
      });
      refreshListeners();
    });
});
