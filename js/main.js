let heldItem
let screwdriversContainer
let equippableItemsBackup
let camera

window.addEventListener('load', () => {
  const equippableItems = document.getElementsByClassName('pickup')
  heldItem = null
  screwdriversContainer = document.getElementById('screwdrivers')
  equippableItemsBackup = equippableItems
  camera = document.getElementById("camera")
})

AFRAME.registerComponent('screw', {
  schema: {
    color: { type: 'string', default: 'red' }
  },
  init: function () {
    const { el, data } = this;
    const { color } = data

    el.setAttribute('gltf-model', `../assets/screws/screw_${color}/screw_${color}.gltf`)

    el.addEventListener('click', () => removeScrew(el));
  }
})

AFRAME.registerComponent('screwdriver', {
  init: function () {
    const { el } = this;

    el.addEventListener('click', changeScrewdriver);
  }
})

removeScrew = (element) => {
  console.log('Clicked!')
  // element.remove();
  element.setAttribute('color', 'red')
  // console.log(element);
}

function setHeldItem(item) {
  heldItem = item

  heldItem.setAttribute('position', "0.55 -0.192 -1.161")
  heldItem.setAttribute('rotation', "-75.6 21.8 172.2")
  heldItem.setAttribute('scale', "0.1 0.1 0.1")

  camera.appendChild(heldItem)
}

function changeScrewdriver(event) {
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