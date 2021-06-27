let heldItem
let screwdriversContainer
let paintdotsSheepContainer
let screwsContainer
let equippableItemsBackup
let camera
let rustlingSound = new Audio('../audio/screwing.mp3')
let bgWind = new Audio('../audio/bg_wind.mp3')
bgWind.loop = true
bgWind.volume = 0.5
let videoPhase = 0
let mayScrew = false
let paintDrawing = "sheep";

window.addEventListener('load', () => {
  startupSequence(true)
  // goToPlaneScene()
  // goToFlyScene()
  // let prince = document.getElementById('little_prince')
  // prince.setAttribute('animation-mixer', 'clip: run; loop: true')
})

function startGame() {
  // goToPlaneScene()
  const equippableItems = document.getElementsByClassName('pickup')
  heldItem = null
  screwdriversContainer = document.getElementById('screwdrivers')
  screwsContainer = document.getElementById('screws')
  paintdotsSheepContainer = document.getElementById('paintdots_sheep')
  paintdotsSmallSheepContainer = document.getElementById('paintdots_smallsheep')
  paintdotsBoxContainer = document.getElementById('paintdots_box')

  equippableItemsBackup = equippableItems
  camera = document.getElementById("camera")
  camera.object3D.position.set(-25.89556, 5.93343, -5.41987);
}

AFRAME.registerComponent('prince', {
  init: function () {
    this.animation
    this.lookAtMeCount = 1
    this.lookAtMeAudio = new Audio('audio/littlePrince/lookatme1.mp3')
    this.lookAtMeAudio.volume = 0.5
    this.lookAtMeAudio.play()
    this.lookAtMeAudio.addEventListener('ended', () => {
      setTimeout(() => {
        this.lookAtMeCount = this.lookAtMeCount % 3 + 1
        this.lookAtMeAudio.src = `audio/littlePrince/lookatme${this.lookAtMeCount}.mp3`
        this.lookAtMeAudio.play()
      }, 1000)
    })
  }
})

AFRAME.registerComponent('screw', {
  schema: {
    color: { type: 'string', default: 'red' }
  },
  init: function () {
    const { el, data } = this;
    const { color } = data

    this.animDuration = 3000
    this.hovering = false

    el.setAttribute('gltf-model', `../assets/screws/screw_${color}/screw_${color}.gltf`)

    el.addEventListener('click', () => removeScrew(this));
    el.addEventListener('mouseleave', () => resetScrew(this))

    var self = this;
    this.time = 0;
    this.animation = AFRAME.ANIME({
      targets: [{x: -Math.PI / 2, y: 0, z: 0}],
      autoplay: false,
      duration: this.animDuration,
      easing: "linear",
      update: function (animation) {
        // var value = animation.animatables[0].target;
        self.el.object3D.scale.set(
          0.5 + (self.time / self.animDuration), 0.5 + (self.time / self.animDuration), 0.5 + (self.time / self.animDuration)
        );
      },
      complete: function () {
        new Audio('../audio/pop.mp3').play();
        el.remove()
        if (screwsContainer.children.length === 0){
          heldItem.remove();
          goToPaintScene();
        }
      }
    });
    this.animation.began = true;
  },
  tick: function (t, dt) {
    if (this.hovering) {
      this.time += dt;
      this.animation.tick(this.time);
    } else if (!this.hovering && this.time > 0) {
      this.time = 0
    }
  }
})

AFRAME.registerComponent('screwdriver', {
  init: function () {
    const { el } = this;

    el.addEventListener('click', changeScrewdriver);
  }
})

AFRAME.registerComponent('paintdot', {
  schema: {
    id: { type: 'int' }
  },
  init: function () {
    const { el, data } = this;
    const { id } = data;


    el.addEventListener('mouseenter', () => {
      if (heldItem){
        if (paintDrawing === "box"){
          if (id === 4){
            new Audio('../audio/littlePrince/thissheepisperfect.mp3').play();
            setTimeout(() => {
              paintdotsBoxContainer.setAttribute('visible', 'false');
              goToPlaneScene();
              heldItem.remove();
            }, 5000)
          } else {
            let pencilWrite = new Audio('../audio/pencil_write.mp3')
            pencilWrite.volume = 0.1
            pencilWrite.play();
            paintdotsBoxContainer.children[id].setAttribute('visible', true);
            }
        } else if (paintDrawing === "sheep"){
          if (id === 27){
            new Audio('../audio/littlePrince/thatsheepistobig.mp3').play();
            setTimeout(() => {
              paintdotsSheepContainer.setAttribute('visible', 'false');
              document.getElementById('paintdots_sheep').remove()
              paintDrawing = "smallsheep";
            }, 5000)
            setTimeout(() => {
              paintdotsSmallSheepContainer.setAttribute('visible', 'true');
            }, 100)
        } else {
          let pencilWrite = new Audio('../audio/pencil_write.mp3')
          pencilWrite.volume = 0.1
          pencilWrite.play();
          paintdotsSheepContainer.children[id].setAttribute('visible', true);
          }
        } else if (paintDrawing === "smallsheep"){
          if (id === 14){
            new Audio('../audio/littlePrince/thatsheepistoosmall.mp3').play();
            setTimeout(() => {
              paintdotsSmallSheepContainer.setAttribute('visible', 'false');
              document.getElementById('paintdots_smallsheep').remove()
              paintDrawing = "box";
              paintdotsBoxContainer.setAttribute('visible', 'true');
            }, 5000)
        } else {
          let pencilWrite = new Audio('../audio/pencil_write.mp3')
          pencilWrite.volume = 0.1
          pencilWrite.play();
          paintdotsSmallSheepContainer.children[id].setAttribute('visible', true);
          }
        }
      } else {
        new Audio('../audio/littlePrince/whatareyoudoing.mp3').play()
      }
    });
  }
})

AFRAME.registerComponent('pencil', {
  init: function () {
    const { el } = this;

    el.addEventListener('click', changeScrewdriver);
  }
})

function startupSequence(skip=false) {
  let video = document.getElementById('intro_video');
  video.volume = 0.2;
  video.src = 'video/little_prince_intro_trim.mp4'
  
  let titleText = document.getElementById('title_text');

  if (skip) {
    titleText.remove()
    video.remove()
    document.getElementById('mainScene').classList.remove('hide')
    startGame()
    return
  }


  video.addEventListener('ended', function(){
      videoPhase++
      
      if (videoPhase < 2) {
        titleText.classList.add('visible')
        video.classList.add('hide')
        bgWind.play()

        setTimeout(() => {
          titleText.classList.remove('visible')
          video.classList.remove('hide')
          video.src = 'video/little_prince_intro_trim_2.mp4'
        }, 3000)
      } else {
        titleText.classList.add('visible')
        video.classList.add('hide')
        titleText.innerHTML = 'LITTLE PRINCE VR'
        setTimeout(() => {
          titleText.remove()
          document.getElementById('mainScene').classList.remove('hide')
          startGame()
        }, 3000)
      }
  })
}

resetScrew = (element) => {
  rustlingSound.currentTime = 0
  rustlingSound.pause()
  element.hovering = false
  element.time = 0
  element.el.setAttribute('scale', '0.5 0.5 0.5')
}

removeScrew = (element) => {
  if (!heldItem || !heldItem.getAttribute('id').endsWith(element.data.color))
    return

  rustlingSound.play()
  element.hovering = true
}

function setHeldItem(item) {
  heldItem = item

  heldItem.setAttribute('position', "0.55 -0.192 -1.161")
  heldItem.setAttribute('rotation', "-75.6 21.8 172.2")
  heldItem.setAttribute('scale', "0.1 0.1 0.1")

  camera.appendChild(heldItem)
}

function changeScrewdriver(event) {
  let pickupAudio = new Audio('../audio/pickup.mp3')
  pickupAudio.play()

  if (heldItem !== null) {
    let foundBackup = null

    for (let i = 0; i < equippableItemsBackup.length; i++) {
      let backupId = equippableItemsBackup[i].getAttribute('id')
      let heldId = heldItem.getAttribute('id')

      if (backupId == heldId)
        foundBackup = equippableItemsBackup[i]
    }

    if (foundBackup == null) return

    let clonedBackup = foundBackup.cloneNode(true)
    clonedBackup.addEventListener('click', changeScrewdriver)
    screwdriversContainer.appendChild(clonedBackup)

    heldItem.remove()
    this.remove()

    setHeldItem(event.currentTarget.cloneNode(true))

    return
  }

  let copiedNode = event.currentTarget.cloneNode(true)

  setHeldItem(copiedNode)

  if (heldItem == null) {
    heldItem = copiedNode
  }

  this.remove()
}

goToPlaneScene = () => {
  document.querySelector('#lord-fader').emit('animate');
  setTimeout(() => {
    switchScene('paintScene', 'screwScene');
    camera.object3D.position.set(0, 0, 0);
  }, 2000)
}

goToFlyScene = () => {
  document.querySelector('#lord-fader').emit('animate');
  setTimeout(() => {
    switchScene('screwScene', 'planeScene');
    camera.object3D.position.set(2, 53, -290);
  }, 2000)
}

switchScene = (currScene, newScene) => {
  document.getElementById(newScene).setAttribute('visible', 'true')
  document.getElementById(currScene).setAttribute('visible', 'false')
}
