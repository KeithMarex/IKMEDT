for (let i = 1; i <= 9; i++){
  AFRAME.registerComponent(`screw${i}`, {
    init: function () {
      const { el } = this;

      removeScrew(el);
    }
  });
}

removeScrew = (element) => {
  return element.addEventListener("mouseenter", function() {
    this.remove();
  })
}
