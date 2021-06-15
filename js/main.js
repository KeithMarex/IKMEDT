for (let i = 1; i <= 9; i++){
  AFRAME.registerComponent(`screw${i}`, {
    init: function () {
      var el = this.el;
      var data = this.data;

      removeScrew(el);
    }
  });
}

removeScrew = (element) => {
  return element.addEventListener("mouseenter", () => {
    element.remove();
  })
}
