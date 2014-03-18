(function() {
  // sidebar active item
  var activeNode = document.querySelector('.sidebar a[href="'+window.location.pathname+'"]');
  if (activeNode) {
    activeNode.className = 'active';
  }
})();