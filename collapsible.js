window.onload = function() {
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function(event) {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "none"){
        content.style.display = "block";
      } else {
        content.style.display = "none";
      } 
    });
  }

  // Add event listener for 'i' icon
  var infoIcon = document.getElementById("info-icon");
  infoIcon.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent triggering the parent's click event
    var detailedCalculationButton = document.getElementById("detailed-calculation-button");
    detailedCalculationButton.click();
  });
}
