const screws = ['screw1', 'screw2', 'screw3', 'screw4', 'screw5', 'screw6', 'screw7', 'screw8', 'screw9'];

for (let screw of screws){
  AFRAME.registerComponent(screw, {
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
