const equippableItems = document.getElementsByClassName('pickup')
const equippableItemsBackup = equippableItems
const camera = document.getElementById("camera")
let heldItem = null

for (let equippableItem of equippableItems) {
  console.log(equippableItem)
  equippableItem.addEventListener('click', function(event) {
    console.log('CLICKED')
    if (heldItem !== null) {
      return
    }

    let copiedNode = event.currentTarget.cloneNode(true)
    
    copiedNode.setAttribute('rotation', "65 110 100")
    copiedNode.setAttribute('position', "1 -1 -5")

    camera.appendChild(copiedNode)

    if (heldItem == null) {
      heldItem = copiedNode
    }
    this.remove()
  })
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
