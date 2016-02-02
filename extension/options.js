// save last update
(function () {
    var showLastUpdate = JSON.parse(localStorage.showLastUpdate || true),
        input = document.getElementById('showLastUpdate');
    
    input.checked = showLastUpdate;

    console.log(showLastUpdate)

    input.addEventListener('change', function () {
        localStorage.showLastUpdate = input.checked;
    });
})();