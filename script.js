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