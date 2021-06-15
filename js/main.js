AFRAME.registerComponent("screw1", {
  schema: {
    default: ""
  },
  init: function() {
    var data = this.data;
    var el = this.el;
    // var fernando = document.querySelector("#fernando");
    el.addEventListener("mouseenter", function() {
      // fernando.setAttribute("scale", "2 2 2");
      alert('JOEHOE');
    });
  }
});
