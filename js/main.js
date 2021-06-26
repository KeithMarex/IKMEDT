let heldItem
let screwdriversContainer
let paintdotsContainer
let screwsContainer
let equippableItemsBackup
let camera
let rustlingSound = new Audio('../audio/screwing.mp3')
let bgWind = new Audio('../audio/bg_wind.mp3')
bgWind.loop = true
bgWind.volume = 0.25
bgWind.play()

window.addEventListener('load', () => {
  const equippableItems = document.getElementsByClassName('pickup')
  heldItem = null
  screwdriversContainer = document.getElementById('screwdrivers')
  screwsContainer = document.getElementById('screws')
  paintdotsContainer = document.getElementById('paintdots')
  equippableItemsBackup = equippableItems
  camera = document.getElementById("camera")
  // goToPaintScene()
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


    el.addEventListener('click', () => {
      if (heldItem){
        if (id === 27){
          new Audio('../audio/kids_cheering.mp3').play();
        } else {
          new Audio('../audio/pencil_write.mp3').play();
        console.log(paintdotsContainer.children[id]);
        this.el.classList.remove('interactable');
        paintdotsContainer.children[id].setAttribute('visible', true);
        }
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

goToPaintScene = () => {
  document.querySelector('#lord-fader').emit('animate');
  setTimeout(() => {
    switchScene('screwScene', 'paintScene');
    camera.object3D.position.set(-25.89556, 5.93343, -5.41987);
  }, 2000)

}

switchScene = (currScene, newScene) => {
  document.getElementById(newScene).setAttribute('visible', 'true')
  document.getElementById(currScene).setAttribute('visible', 'false')
}
