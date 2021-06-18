const equippableItems = document.getElementsByClassName('pickup')
const screwdriversContainer = document.getElementById('screwdrivers')
const equippableItemsBackup = equippableItems
const camera = document.getElementById("camera")
let heldItem = null

for (let equippableItem of equippableItems) {
  equippableItem.addEventListener('click', changeScrewdriver)
}

for (let i = 1; i <= 9; i++){
  AFRAME.registerComponent(`screw${i}`, {
    init: function () {
      const { el } = this;

      removeScrew(el);
    }
  });
}

removeScrew = (element) => {
  return element.addEventListener("click", () => {
    console.log('CLICKED')
    // element.remove();
    element.setAttribute('color', 'red')
    // console.log(element);
  })
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