(function () {

    let pictures = document.querySelectorAll('.pictures .picture')

    let shufflePicturesName = shuffle([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);

    function shuffle(array) {
        // copy of the "array"
        let tmpArray = array.slice(0, array.length);
        let resultArray = [];
        for (let i = 0; i < array.length; i++) {
            // generate random integer in range 0 to the array length
            let randomInt = Math.floor(Math.random() * tmpArray.length);
            // remove one (1) element from the array on position randomInt
            let removeElement = tmpArray.splice(randomInt, 1);
            resultArray.push(removeElement[0]);
        }
        return resultArray;
    }

    function showPicture() {
        let k = 0;
        let divId = this.id;
        let selectedDiv = document.getElementById(divId);
        let newImg = document.createElement('img');
        newImg.src = "img/" + shufflePicturesName[divId] + ".png";
        newImg.setAttribute('alt', 'Image discovered');
        selectedDiv.innerHTML = "";
        k += 180;
        selectedDiv.style.transform = "rotatey(" + k + "deg)";
        selectedDiv.style.transitionDuration = "0.5s";
        selectedDiv.appendChild(newImg);
        countDiscovered();
    }

    function countDiscovered() {
        let i = 0;
        let srcArray = [];
        pictures.forEach(image => {
            let images = image.getElementsByTagName('img');
            let imgSrc = images.item(0).getAttribute('src');
            srcArray.push(imgSrc);
        });

        for (let path of srcArray) {
            if(!path.endsWith("back.png") && !path.endsWith("empty.png")) {
                i++;
            }
        }
        console.log(i)
        return i;
    }

    function addListener() {
        pictures.forEach(image => {
            image.addEventListener("click", showPicture)
        });
    }

    function initGame() {
        addListener();
    }

    initGame();

})();
