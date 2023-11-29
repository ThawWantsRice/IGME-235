window.onload = (e) => {
    document.querySelector("#breedDropdown").addEventListener("change", searchButtonClicked);
    document.querySelector("#searchButton").addEventListener("click", searchRandomImage);
    document.querySelector("#clearLocalStorage").addEventListener("click", clearLocalStorage);
    document.querySelector("#homeLink").addEventListener("click", refreshPage);
    document.querySelector("#breedDropdown").addEventListener("change", updateSubBreedDropdown);
    getDogBreeds();
};

function refreshPage() {
    location.reload();
}

function searchButtonClicked() {
    const selectedBreed = document.querySelector("#breedDropdown").value;
    const subBreedSelect = document.querySelector("#subBreedDropdown").value;

    if (!selectedBreed) {
        alert("Please select a dog breed");
        return;
    }

    // Highlight the selected breed
    highlightSelectedBreed(selectedBreed);
    highlightSelectedBreed(subBreedSelect);
}

function highlightSelectedBreed(selectedBreed) {
    const breedDropdown = document.querySelector("#breedDropdown");
    const subBreedDropdown = document.querySelector("#subBreedDropdown");

    for (const option of breedDropdown.options) {
        option.style.fontWeight = "normal";
    }

    for (const option of subBreedDropdown.options) {
        option.style.fontWeight = "normal";
    }

    const selectedOption = breedDropdown.querySelector(`[value="${selectedBreed}"]`);
    if (selectedOption) {
        selectedOption.style.fontWeight = "bold";
    }

    const selectedSubBreedOption = subBreedDropdown.querySelector(`[value="${selectedBreed}"]`);
    if (selectedSubBreedOption) {
        selectedSubBreedOption.style.fontWeight = "bold";
    }
}

function updateSubBreedDropdown() {
    const selectedBreed = document.querySelector("#breedDropdown").value;

    if (!selectedBreed) {
        return;
    }

    const subBreedsUrl = `https://dog.ceo/api/breed/${selectedBreed}/list`;

    let xhrSubBreeds = new XMLHttpRequest();
    xhrSubBreeds.onreadystatechange = function () {
        if (xhrSubBreeds.readyState == 4) {
            if (xhrSubBreeds.status == 200) {
                const subBreedsData = JSON.parse(xhrSubBreeds.responseText);
                updateDropdownOptions(subBreedsData.message);
            } else {
                console.error("Error fetching sub-breeds:", xhrSubBreeds.statusText);
            }
        }
    };

    xhrSubBreeds.open("GET", subBreedsUrl);
    xhrSubBreeds.send();
}

function updateDropdownOptions(subBreeds) {
    const subBreedDropdown = document.querySelector("#subBreedDropdown");
    subBreedDropdown.innerHTML = ""; // Clear existing options

    if (subBreeds && subBreeds.length > 0) {
        // Create a default option for no sub-breed selected
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select Sub-Breed";
        subBreedDropdown.add(defaultOption);

        // Add sub-breeds to the dropdown
        subBreeds.forEach(subBreed => {
            const option = document.createElement("option");
            option.value = subBreed;
            option.text = subBreed;
            subBreedDropdown.add(option);
        });

        // Show the sub-breed dropdown
        subBreedDropdown.style.display = "inline-block";
    } else {
        // Hide the sub-breed dropdown if no sub-breeds available
        subBreedDropdown.style.display = "none";
    }
}

function clearLocalStorage() {
    localStorage.clear();
    alert("Local storage cleared!");
}

function searchRandomImage() {
    const selectedBreed = document.querySelector("#breedDropdown").value;

    if (!selectedBreed) {
        alert("Please select a dog breed");
        return;
    }

    const DOG_API_URL_IMAGES = `https://dog.ceo/api/breed/${selectedBreed}/images/random`;

    let xhrImage = new XMLHttpRequest();
    xhrImage.onreadystatechange = function () {
        if (xhrImage.readyState == 4) {
            if (xhrImage.status == 200) {
                const randomImageData = JSON.parse(xhrImage.responseText);
                displayRandomImage(selectedBreed, randomImageData.message);
            } else {
                console.error("Error fetching random dog image:", xhrImage.statusText);
                document.querySelector("#imageSearchStatus").innerHTML = "<b>Error fetching random dog image</b>";
            }
        }
    };

    xhrImage.open("GET", DOG_API_URL_IMAGES);
    xhrImage.send();
}

function displayRandomImage(selectedBreed, imageUrl) {
    const dogImage = document.querySelector("#dogImage");
    const imageSearchStatus = document.querySelector("#imageSearchStatus");
    const breedInfo = document.querySelector("#breedInfo");

    const recentImages = JSON.parse(localStorage.getItem("recentImages")) || [];

    if (!recentImages.includes(imageUrl)) {
        dogImage.src = imageUrl;

        recentImages.push(imageUrl);

        if (recentImages.length > 5) {
            recentImages.shift();
        }

        localStorage.setItem("recentImages", JSON.stringify(recentImages));

        let breedInfoContent = `<b>Breed Info:</b><p><i>Name: ${selectedBreed}</i></p>`;

        const subBreedsUrl = `https://dog.ceo/api/breed/${selectedBreed}/list`;

        let xhrSubBreeds = new XMLHttpRequest();
        xhrSubBreeds.onreadystatechange = function () {
            if (xhrSubBreeds.readyState == 4) {
                if (xhrSubBreeds.status == 200) {
                    const subBreedsData = JSON.parse(xhrSubBreeds.responseText);
                    breedInfo.innerHTML = breedInfoContent;

                    imageSearchStatus.innerHTML = `<b>Success!</b><p><i>Random image of the ${selectedBreed} breed</i></p>`;
                } else {
                    console.error("Error fetching sub-breeds:", xhrSubBreeds.statusText);
                }
            }
        };

        xhrSubBreeds.open("GET", subBreedsUrl);
        xhrSubBreeds.send();
    } else {
        imageSearchStatus.innerHTML = `<b>Image already displayed for the ${selectedBreed} breed</b>`;
    }
}

function getDogBreeds() {
    const DOG_API_URL = "https://dog.ceo/api/breeds/list/all";

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                displayDogBreeds(data.message);
            } else {
                console.error("Error fetching dog breeds:", xhr.statusText);
                document.querySelector("#dogBreedsStatus").innerHTML = "<b>Error fetching dog breeds</b>";
            }
        }
    };

    xhr.open("GET", DOG_API_URL);
    xhr.send();
}

function displayDogBreeds(dogBreeds) {
    const breedDropdown = document.querySelector("#breedDropdown");

    // Add each dog breed to the dropdown
    for (const breed in dogBreeds) {
        const option = document.createElement("option");
        option.value = breed;
        option.text = breed[0].toUpperCase() + breed.slice(1);
        breedDropdown.add(option);
    }

    document.querySelector("#dogBreedsStatus").innerHTML = "<b>Success!</b><p><i>Here are dog breeds</i></p>";
}

function searchImagesForSubBreed(selectedBreed, subBreed) {
    const subBreedImageUrl = `https://dog.ceo/api/breed/${selectedBreed}/${subBreed}/images/random`;

    let xhrSubBreedImage = new XMLHttpRequest();
    xhrSubBreedImage.onreadystatechange = function () {
        if (xhrSubBreedImage.readyState == 4) {
            if (xhrSubBreedImage.status == 200) {
                const subBreedImageData = JSON.parse(xhrSubBreedImage.responseText);
                displayRandomImage(`${selectedBreed} - ${subBreed}`, subBreedImageData.message);
            } else {
                console.error("Error fetching random dog image:", xhrSubBreedImage.statusText);
                document.querySelector("#imageSearchStatus").innerHTML = "<b>Error fetching random dog image</b>";
            }
        }
    };

    xhrSubBreedImage.open("GET", subBreedImageUrl);
    xhrSubBreedImage.send();
}