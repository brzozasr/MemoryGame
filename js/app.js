(function () {

    let pictures = document.querySelectorAll('.pictures .picture')

    let shufflePicturesName = shuffle([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);

    let picturesDiscovered = [];

    let start = Date.now();

    let intervalStop;

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
        if (countDiscovered() < 2) {
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
            picturesDiscovered.push(newImg.getAttribute("src"));

            if (countDiscovered() === 2 && picturesDiscovered.length === 2) {
                if (picturesDiscovered[0] === picturesDiscovered[1]) {
                    setTimeout(removePictures, 1000);
                } else {
                    setTimeout(hidePictures, 1000);
                }

                picturesDiscovered.splice(0, picturesDiscovered.length);
            }
        }
    }

    function hidePictures() {
        pictures.forEach(image => {
            let images = image.getElementsByTagName('img');
            let imgSrc = images.item(0).getAttribute('src');

            if (!imgSrc.endsWith("back.png") && !imgSrc.endsWith("empty.png")) {
                let newImg = document.createElement('img');
                newImg.src = "img/back.png";
                newImg.setAttribute('alt', 'Image hide');
                image.innerHTML = "";
                image.appendChild(newImg);
                image.removeAttribute('style');
            }
        });
    }

    function removePictures() {
        pictures.forEach(image => {
            let images = image.getElementsByTagName('img');
            let imgSrc = images.item(0).getAttribute('src');

            if (!imgSrc.endsWith("back.png") && !imgSrc.endsWith("empty.png")) {
                let newImg = document.createElement('img');
                newImg.src = "img/empty.png";
                newImg.setAttribute('alt', 'Empty image');
                image.innerHTML = "";
                image.appendChild(newImg);
                image.removeAttribute('style');
                image.removeEventListener("click", showPicture)
            }

            if (allDiscovered()) {
                clearInterval(intervalStop);
                writeBestTime();
            }
        });
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
            if (!path.endsWith("back.png") && !path.endsWith("empty.png")) {
                i++;
            }
        }
        return i;
    }

    function allDiscovered() {
        let srcArray = [];
        pictures.forEach(image => {
            let images = image.getElementsByTagName('img');
            let imgSrc = images.item(0).getAttribute('src');
            if (imgSrc.endsWith("empty.png")) {
                srcArray.push(imgSrc);
            }
        });

        return srcArray.length === 12;
    }

    function startTimer() {
        let distance = Date.now() - start;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / (1000));
        let secAndMilisec = (distance / 1000).toFixed(3).split(".");
        let milliseconds = secAndMilisec[1];

        document.getElementById("time").innerHTML = pad(minutes) + ":" + pad(seconds) + "." + milliseconds;
    }

    function pad(val) {
        let valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    function writeBestTime() {
        let htmlTime = document.querySelector('#time');
        let htmlBestTime = document.querySelector('#best-time');

        if (compareTimes(htmlTime.textContent, htmlBestTime.textContent)) {
            localStorage.setItem("bestTimeMemoryGame", htmlTime.textContent);
            htmlBestTime.textContent = htmlTime.textContent;
            setTimeout(function () {
                alert("You had the best time in the game " + htmlTime.textContent + " min.\nThe new best time will be saved.");
            }, 500);
        }
    }

    function readBestTime() {
        let bestTimeScore = localStorage.getItem("bestTimeMemoryGame");
        let htmlBestTime = document.querySelector('#best-time');

        if (bestTimeScore) {
            htmlBestTime.textContent = bestTimeScore;
        }
    }

    function compareTimes(achievedTime, bestTime) {
        let achievedArray = achievedTime.split(':');
        let achievedMin = parseInt(achievedArray[0]);
        let achievedSec = parseInt(achievedArray[1].split('.')[0]);
        let achievedMilSec = parseInt(achievedArray[1].split('.')[1]);

        let bestArray = bestTime.split(':');
        let bestMin = parseInt(bestArray[0]);
        let bestSec = parseInt(bestArray[1].split('.')[0]);
        let bestMilSec = parseInt(bestArray[1].split('.')[1]);

        let achievedMinToMilSec = achievedMin * 60000;
        let achievedSecToMilSec = achievedSec * 1000;
        let sumAchievedMilSec = achievedMinToMilSec + achievedSecToMilSec + achievedMilSec;

        let bestMinToMilSec = bestMin * 60000;
        let bestSecToMilSec = bestSec * 1000;
        let sumBestMilSec = bestMinToMilSec + bestSecToMilSec + bestMilSec;

        return sumAchievedMilSec < sumBestMilSec;
    }

    function addListener() {
        pictures.forEach(image => {
            image.addEventListener("click", showPicture)
        });
    }

    function initGame() {
        addListener();
        intervalStop = setInterval(startTimer, 100);
        readBestTime();

        // localStorage.clear();
    }

    initGame();

})();
