function hideMenu() {
  var menuMobile = document.querySelector(".mobile-header");
  menuMobile.style.opacity = "0";
  menuMobile.style.pointerEvents = "none";
}

document.getElementById("menu_mobile").addEventListener("click", function () {
  var menuMobile = document.querySelector(".mobile-header");
  if (menuMobile.style.opacity === "1") {
    hideMenu();
  } else {
    menuMobile.style.opacity = "1";
    menuMobile.style.pointerEvents = "auto";
  }
});

document.getElementById("close").addEventListener("click", function () {
  hideMenu();
});
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuLinks = document.querySelectorAll("#mobile-header .menu a");
  const mobileMenu = document.getElementById("mobile-header");

  mobileMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      mobileMenu.style.opacity = "0";
      mobileMenu.style.pointerEvents = "none";

      const anchorId = event.target.getAttribute("href").slice(1);

      const anchorElement = document.getElementById(anchorId);

      if (anchorElement && anchorElement.classList.contains("anchor")) {
        anchorElement.scrollIntoView({ behavior: "smooth" });
        event.preventDefault();
      }
    }
  });
});
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function fadeInOnScroll() {
  document.querySelectorAll(".fade-in").forEach(function (element) {
    if (isInViewport(element)) {
      element.classList.add("visible");
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const languageLinks = document.querySelectorAll(".leng a");

  function updateActiveLink(lang) {
    languageLinks.forEach((link) => {
      if (link.getAttribute("data-lang") === lang) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  languageLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const lang = this.getAttribute("data-lang");
      const currentPath = window.location.pathname;

      const pathSegments = currentPath
        .split("/")
        .filter((segment) => segment.length > 0);
      const currentLang = pathSegments.length > 0 ? pathSegments[0] : "";
      const newPath = currentLang.match(/en|ru|uk/)
        ? currentPath.replace(`/${currentLang}`, `/${lang}`)
        : `/${lang}${currentPath}`;

      updateActiveLink(lang);

      if (currentPath === "/" || currentPath === `/${currentLang}/index.html`) {
        window.location.href = `/${lang}/`;
      } else {
        window.location.href = newPath.replace("/index.html", "/");
      }
    });
  });

  const currentLang = window.location.pathname.split("/")[1];
  updateActiveLink(currentLang);
});

$(document).ready(function () {
  $("img.lazy")
    .each(function () {
      $(this).attr("loading", "lazy");
    })
    .lazyload({
      effect: "fadeIn",
    });

  fadeInOnScroll();

  $(window).on("scroll", fadeInOnScroll);
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const blurBackground = document.querySelector(".blur-background");
  const checkButtons = document.querySelectorAll(".check");
  const closeButton = document.getElementById("close_form");
  const sendButton = document.getElementById("send_form_data");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nickInput = document.getElementById("nick");
  const serviceSelect = document.getElementById("service");
  const notification = document.getElementById("notification");

  let nameFlag = false;
  let phoneFlag = false;
  let serviceFlag = false;

  function showPopup() {
    form.classList.add("show");
    blurBackground.style.display = "block";
    setTimeout(() => {
      blurBackground.style.opacity = "1";
      setTimeout(() => {
        form.style.opacity = "1";
        form.style.transform = "translate(-50%, -50%) scale(1)";
        form.style.pointerEvents = "all";
      }, 10);
    }, 100);
  }

  function hidePopup() {
    form.style.opacity = "0";
    form.style.transform = "translate(-50%, -50%) scale(0.9)";
    blurBackground.style.opacity = "0";
    form.style.pointerEvents = "none";
    setTimeout(() => {
      blurBackground.style.display = "none";
    }, 1000);
  }

  function showNotification() {
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.style.display = "none";
      }, 300);
    }, 6000);
  }

  checkButtons.forEach((button) => {
    button.addEventListener("click", showPopup);
  });

  closeButton.addEventListener("click", hidePopup);

  function checkFlags() {
    nameFlag = nameInput.value.trim() !== "";
    phoneFlag =
      /^\d+$/.test(phoneInput.value.replace(/\D/g, "")) &&
      phoneInput.value.length >= 10;
    serviceFlag = serviceSelect.value !== "";

    if (nameFlag && phoneFlag && serviceFlag) {
      sendButton.style.opacity = "1";
      sendButton.disabled = false;
    } else {
      sendButton.style.opacity = "0.5";
      sendButton.disabled = true;
    }
  }

  nickInput.addEventListener("input", checkFlags);
  phoneInput.addEventListener("input", function () {
    var phoneNumberDigitsOnly = phoneInput.value.replace(/\D/g, "");
    phoneInput.value = phoneNumberDigitsOnly;
    checkFlags();
  });

  nameInput.addEventListener("input", function () {
    nameInput.value = nameInput.value.replace(/[^a-zа-яё\s]/gi, "");
    checkFlags();
  });

  serviceSelect.addEventListener("change", checkFlags);

  function tg_send(text) {
    const CHAT_ID = "-1002079045545";
    const TOKEN = "6900231703:AAHEoNjxpn12WHBWRjteMN8OyviFc8rReBM";
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    axios
      .post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: "Markdown",
        text: text,
      })
      .then(() => {
        nameInput.value = "";
        phoneInput.value = "";
        nickInput.value = "";
        serviceSelect.selectedIndex = 0;
        nameFlag = false;
        phoneFlag = false;
        serviceFlag = false;
        checkFlags();
      });
  }

  function sendInfo() {
    const name_ = nameInput.value;
    const phone_ = phoneInput.value;
    const nick_ = nickInput.value;
    const service_ = serviceSelect.options[serviceSelect.selectedIndex].text;

    const message = `Имя: ${name_}\nНомер: ${phone_}\nНик: ${nick_}\nУслуга: ${service_}`;

    tg_send(message);
    hidePopup();
    showNotification();
  }

  sendButton.addEventListener("click", function () {
    if (!sendButton.disabled) {
      sendInfo();
    }
  });

  checkFlags();
});

document.addEventListener("DOMContentLoaded", function () {
  const tariffs = document.querySelectorAll(
    ".slider-tarif .slider-item3, .slider-tarif .slider-item4"
  );
  const dotsContainer = document.querySelector(".indicators");
  const slider = document.querySelector(".slider-tarif");

  dotsContainer.innerHTML = "";

  tariffs.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("indicator");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      slider.scrollLeft = tariffs[index].offsetLeft;
    });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    const scrollLeft = slider.scrollLeft;
    const tariffWidth = tariffs[0].clientWidth;
    const sliderWidth = slider.clientWidth;

    let activeIndex = Math.round(scrollLeft / tariffWidth);

    if (scrollLeft + sliderWidth >= slider.scrollWidth - tariffWidth / 2) {
      activeIndex = tariffs.length - 1;
    }

    const dots = document.querySelectorAll(".indicator");
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[activeIndex]) {
      dots[activeIndex].classList.add("active");
    }
  }

  slider.addEventListener("scroll", updateDots);

  updateDots();
});
document.addEventListener("DOMContentLoaded", function () {
  const clients = document.querySelectorAll(".con-klients > div");
  const dotsContainer = document.querySelector(".slider-dots");
  const slider = document.querySelector(".con-klients");

  clients.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      slider.scrollLeft = clients[index].offsetLeft;
    });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    const scrollLeft = slider.scrollLeft;
    const clientWidth = clients[0].clientWidth;
    const sliderWidth = slider.clientWidth;
    const maxScrollLeft = slider.scrollWidth - sliderWidth;

    let activeIndex = Math.round(scrollLeft / clientWidth);

    if (scrollLeft + sliderWidth >= slider.scrollWidth - clientWidth / 2) {
      activeIndex = clients.length - 1;
    }

    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[activeIndex]) {
      dots[activeIndex].classList.add("active");
    }
  }

  slider.addEventListener("scroll", updateDots);

  updateDots();
});
