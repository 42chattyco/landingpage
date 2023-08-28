(function () {
  const doc = document
  const rootEl = doc.documentElement
  const body = doc.body
  /* global ScrollReveal */
  const sr = window.sr = ScrollReveal({ mobile: false })

  rootEl.classList.remove('no-js')
  rootEl.classList.add('js')

  const chats = [
    {
      isUser: true,
      message: "Why did you take down your profile picture?"
    },
    {
      isUser: true,
      message: "What the heck is a status name..."
    },
    {
      isUser: true,
      message: "Like we broke up..."
    },
    {
      isUser: false,
      message: "Get rid of it or not, it's my choice.",
    },
    {
      isUser: true,
      message: "Do I have to look like we fought?",
    },
    {
      isUser: false,
      message: "It's my space, but I can't even use it the way I want?",
      feedbackMessage: "You're aggressive in the way you express your feelings, making it harder and harder to find a compromise with the other person. You may come across as self-centered to the other person, not considering their feelings."
    },
    {
      isUser: false,
      message: "Okay, stop talking. I'm going to bed.",
      feedbackMessage: "You're showing indifference by wanting to stop the conversation. In order to find a compromise, you need to keep the conversation going. By being more understanding or showing respect for the other person's opinion, you may be able to find a compromise."
    },
  ]

  window.addEventListener('load', function () {
    body.classList.add('is-loaded')
    addBottomCopy();
    showChat(chats[0]);
  })

  const addBottomCopy = () => {

    const view = document.createElement("div");
    view.className = "bottom-copy";
    const copies = [
    "Share text",
    "or screenshots",
    "of the altercation with us and",
    "we'll get to the bottom of it quickly."
    ];
    copies.forEach((c) => {
      const p = document.createElement("p");
      p.className = "bottom-copy-line";
      p.innerText = c;
      view.appendChild(p);
    });
    const container = document.querySelector(".mockup-container");
    container.appendChild(view);
  }

  // Reveal animations
  function revealAnimations () {
    sr.reveal('.feature-extended .device-mockup', {
      duration: 600,
      distance: '100px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'bottom',
      viewFactor: 0.6
    })
    sr.reveal('.feature-extended .feature-extended-body', {
      duration: 600,
      distance: '40px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'top',
      viewFactor: 0.6
    })
  }

  if (body.classList.contains('has-animations')) {
    window.addEventListener('load', revealAnimations);
  }

  // Particle animation
  let Bubble = function (parentNode) {
    let self = this
    self.parentNode = parentNode
    self.getCanvasSize()
    window.addEventListener('resize', function () {
      self.getCanvasSize()
    })
    self.mouseX = 0
    self.mouseY = 0
    window.addEventListener('mousemove', function (e) {
      self.mouseX = e.clientX
      self.mouseY = e.clientY
    })
    self.randomise()
  }

  Bubble.prototype.getCanvasSize = function () {
    let self = this
    self.canvasWidth = self.parentNode.clientWidth
    self.canvasHeight = self.parentNode.clientHeight
  }

  Bubble.prototype.generateDecimalBetween = function (min, max) {
    return (Math.random() * (min - max) + max).toFixed(2)
  }

  Bubble.prototype.update = function () {
    let self = this
    self.translateX = self.translateX - self.movementX
    self.translateY = self.translateY - self.movementY
    self.posX += ((self.mouseX / (self.staticity / self.magnetism)) - self.posX) / self.smoothFactor
    self.posY += ((self.mouseY / (self.staticity / self.magnetism)) - self.posY) / self.smoothFactor

    if (self.translateY + self.posY < 0 || self.translateX + self.posX < 0 || self.translateX + self.posX > self.canvasWidth) {
      self.randomise()
      self.translateY = self.canvasHeight
    }
  }

  Bubble.prototype.randomise = function () {
    let self = this
    self.colors = ['85,107,139', '38,141,247', '66,52,248', '255,108,80', '243, 244, 255', '96, 100, 131']
    self.velocity = 30 // Bubble levitation velocity (the higher the slower)
    self.smoothFactor = 50 // The higher, the smoother
    self.staticity = 30 // Increase value to make bubbles move slower on mousemove
    self.magnetism = 0.1 + Math.random() * 4
    self.color = self.colors[Math.floor(Math.random() * self.colors.length)]
    self.alpha = self.generateDecimalBetween(5, 10) / 10
    self.size = self.generateDecimalBetween(1, 4)
    self.posX = 0
    self.posY = 0
    self.movementX = self.generateDecimalBetween(-2, 2) / self.velocity
    self.movementY = self.generateDecimalBetween(1, 20) / self.velocity
    self.translateX = self.generateDecimalBetween(0, self.canvasWidth)
    self.translateY = self.generateDecimalBetween(0, self.canvasHeight)
  }

  let Background = function (selector) {
    let self = this
    self.canvas = document.getElementById(selector)
    self.ctx = this.canvas.getContext('2d')
    self.dpr = window.devicePixelRatio
  }

  Background.prototype.start = function () {
    let self = this
    self.canvasSize()
    window.addEventListener('resize', function () {
      self.canvasSize()
    })
    self.bubblesList = []
    self.generateBubbles()
    self.animate()
  }

  Background.prototype.canvasSize = function () {
    let self = this
    self.container = self.canvas.parentNode
    // Determine window width and height
    self.w = self.container.offsetWidth
    self.h = self.container.offsetHeight
    self.wdpi = self.w * self.dpr
    self.hdpi = self.h * self.dpr
    // Set canvas width and height
    self.canvas.width = self.wdpi
    self.canvas.height = self.hdpi
    // Set width and height attributes
    self.canvas.style.width = self.w + 'px'
    self.canvas.style.height = self.h + 'px'
    // Scale down canvas
    self.ctx.scale(self.dpr, self.dpr)
  }

  Background.prototype.animate = function () {
    let self = this
    self.ctx.clearRect(0, 0, self.canvas.clientWidth, self.canvas.clientHeight)
    self.bubblesList.forEach(function (bubble) {
      bubble.update()
      self.ctx.translate(bubble.translateX, bubble.translateY)
      self.ctx.beginPath()
      self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
      self.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'
      self.ctx.fill()
      self.ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0)
    })
    /* global requestAnimationFrame */
    requestAnimationFrame(this.animate.bind(this))
  }

  Background.prototype.addBubble = function (bubble) {
    return this.bubblesList.push(bubble)
  }

  Background.prototype.generateBubbles = function () {
    let self = this
    for (let i = 0; i < self.bubbleDensity(); i++) {
      self.addBubble(new Bubble(self.canvas.parentNode))
    }
  }

  Background.prototype.bubbleDensity = function () {
    return 15
  }

  window.addEventListener('load', function () {
    const heroParticles = new Background('hero-particles')
    const footerParticles = new Background('footer-particles')
    heroParticles.start()
    footerParticles.start()
  })

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60)
      }
    )
  })()

  let isPhonePresenting = false;
  const firstScreen = document.getElementById("first_screen");
  const firstChat = firstScreen.getElementsByClassName("katalk-chat")[0];
  let nextChatIndex = 1;
  let isShowingChat = false;
  const chatInterval = 800;
  let focusedChatIndex = null;

  function disableScroll() {
    if (phonePosition == null)
      return ;
    window.scrollTo({
      top: phonePosition, 
    });
  }

  let phonePosition = null;

  window.onscroll = (() => {
    const wasPhonePresenting = isPhonePresenting;
    isPhonePresenting = this.scrollY > 100;
    if (!wasPhonePresenting && isPhonePresenting && !isShowingChat) {
      var offsets = document.querySelector(".iphonex").getBoundingClientRect();
      phonePosition = window.scrollY + offsets.top;
      startShowChat(); 
    }
  })

  let intervalId = null;
  const startShowChat = () => {
    if (nextChatIndex >= chats.length)
      return ;
    isShowingChat = true;
    intervalId = setInterval(() => {
      if (isShowingChat) {
        showChat(chats[nextChatIndex]);
        if (nextChatIndex == chats.length - 1) {
          setTimeout(showRequestButton, 500);
          stopShowChat();
        }
        nextChatIndex += 1;
      }
    }, chatInterval);
  }

  const stopShowChat = () => {
    isShowingChat = false;
    isPhonePresenting = false;
    if (intervalId == null)
      return ;
    clearInterval(intervalId);
    intervalId = null;
    window.onscroll = () => {};
  }
  
  const showChat = (chat) => {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    if (chat.isUser)
      bubble.classList.add("userchat");
    else
      bubble.classList.add("otherchat");
    bubble.innerHTML = `<span class="textbox">${chat.message}</span>`;
    chat.bubble = bubble;
    firstChat.appendChild(bubble);
    bubble.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
  }

  const showRequestButton = () => {
    const button = document.createElement("div");
    button.className = "request-button-container";
    button.innerHTML = `<button class="request-button">AI analysis results</button>`;
    button.addEventListener("click", (e) => showNextScreen());
    firstChat.appendChild(button);
    button.scrollIntoView({block: "nearest", inline: "nearest"});
  }

  const showNextScreen = () => {
    const phone = document.getElementsByClassName("iphonex")[0];
    const button = document.getElementsByClassName("request-button")[0];
    phone.classList.add("elementToScaleDownLeftTop");
    button.classList.add("elementToFadeOut");
    const firstIndex = chats.findIndex((c) => c.feedbackMessage);
    showFeedbackForChat(firstIndex);
  }

  const showFeedbackForChat = (index) => {
    const chat = chats[index];
    const bubble = chat.bubble;
    const isFirst = focusedChatIndex == null;
    bubble.scrollIntoView(
      {block: "nearest", inline: "nearest", behavior: "smooth"});
    focusedChatIndex = index;
    if (!isFirst) {
      const prevFocused = document.querySelector(".focused");
      prevFocused.classList.remove("focused");
      const feedback = document.querySelector(".feedback");
      changeFeedbackContent(feedback, chat);
    }
    setTimeout(() => {
      let feedback;
      if (isFirst) {
        const requestButton = document.querySelector(".request-button-container");
        requestButton.style.display = "none";
        feedback = createFeedbackView(chat);
        const container = document.getElementsByClassName("mockup-container")[0];
        container.appendChild(feedback);
      } else {
        feedback = document.querySelector(".feedback");
      }
      const nextIndex = findNextIndexFrom(index + 1);
      if (nextIndex == null) {
        focusedChatIndex = null;
      }
      bubble.classList.add("focused");
      presentMessage(chat.feedbackMessage, feedback.querySelector(".feedback-content"));
    }, 1000)
  }

  const changeFeedbackContent = (view, chat) => {
    const chatMessage = view.querySelector(".feedback-chat");
    chatMessage.innerText = `"${chat.message}"`;
    const content = view.querySelector(".feedback-content");
    content.innerText = "";
  }

  const createFeedbackView = (chat) => {
    const view = document.createElement("div");
    view.className = "feedback";
    const title = document.createElement("span");
    title.className = "feedback-title";
    title.innerText = "AI analysis results";
    const chatMessage = document.createElement("p");
    chatMessage.className = "feedback-chat";
    chatMessage.innerText = `"${chat.message}"`;
    const content = document.createElement("p");
    content.className = "feedback-content";
    const nextButton = document.createElement("button");
    nextButton.className = "next-feedback-button";
    nextButton.addEventListener("click", () => showNextFeedback());
    nextButton.innerHTML = `<svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
          <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
          <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
        </svg>
        <span>View the following results</span>`;
    nextButton.style.display = "none";
    view.appendChild(title); 
    view.appendChild(chatMessage);
    view.appendChild(content);
    view.appendChild(nextButton);
    return view;
  }

  const findNextIndexFrom = (index) => {
    for (let i = index; i < chats.length; ++i) {
      if (chats[i].feedbackMessage)
        return i; 
    }
    return null;
  }

  const showNextFeedback = () => {
    const nextButton = document.querySelector(".next-feedback-button");
    nextButton.style.display = "none";
    const nextIndex = findNextIndexFrom(focusedChatIndex + 1);
    if (nextIndex == null) 
      return ;
    showFeedbackForChat(nextIndex);
  }

  const presentMessage = (message, view) => {
    const str = message.toString();
    const words = str.split(" ");
    let i = 0;

    const timer = () => {

      view.innerText += " " + words[i];
      ++i;
      if (i < words.length) {
        setTimeout(timer, Math.random() * 300);
      }else {
        if (focusedChatIndex != null) {
        const nextbutton = document.querySelector(".next-feedback-button");
          nextbutton.style = "block";
        }
      }
    }
    setTimeout(timer, 100);
  }
}())
