const equippableItems = document.getElementsByClassName('pickup')
const camera = document.getElementById("camera")
const heldItem = null

for (let equippableItem of equippableItems) {
  console.log(equippableItem)
  equippableItem.addEventListener('click', (event) => {
    console.log('CLICKED')
    console.log(event)
    if (heldItem == null) {
      
    }
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
