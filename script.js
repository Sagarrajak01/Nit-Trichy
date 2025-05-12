let navLinks = document.getElementById("navLinks");
function showMenu() {
    navLinks.style.right = "0";
    document.addEventListener("click", outsideClickHandler);
}

function hideMenu() {
    navLinks.style.right = "-200px";
    document.removeEventListener("click", outsideClickHandler);
}

function outsideClickHandler(e) {
    const isClickInside = navLinks.contains(e.target);
    const isMenuButton = e.target.classList.contains("fa-bars");

    if (!isClickInside && !isMenuButton) {
        hideMenu();
    }
}

emailjs.init('sagarrajaknitt@gmail.com');

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  if (!name || !email || !subject || !message) {
    alert('Please fill all fields before submitting.');
    return;
  }

  const templateParams = {
    name: name,
    email: email,
    subject: subject,
    message: message,
  };

  emailjs.send('service_61o9rxc', 'templates_cwgsykd', templateParams)
    .then(function(response) {
      alert('Message sent successfully!');
      document.getElementById('contact-form').reset();
    }, function(error) {
      alert('Failed to send message. Please try again.');
      console.error('Error:', error);
    });
});
