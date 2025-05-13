// Getting html elements
const searchInput = document.getElementById("search-input");

const results = document.getElementById("results");

const dialog = document.getElementById("popup-dialog");
const characterTitle = document.getElementById("character-title");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog");


function debounce(func, wait) {
  let timeout;

  return function (...args) { //...args can accept any number of arguments.
    const context = this; // Save the current 'this' context because it will change inside setTimeout

    clearTimeout(timeout); // Clear any existing timeout to reset the wait period. You're checking if the user stopped typing not with if, but by constantly resetting the timer with clearTimeout.

    // Call the original function with the correct 'this' and original arguments
    timeout = setTimeout(() => { 
      func.apply(context, args); 
    }, wait);
  };
}


// Adding an event listener that listens to whenever the user types something into the search bar
searchInput.addEventListener("input", function (e) {
  // Get the value of the input
  const input = e.target.value;
  console.log(input);
  //searchForCharacter(input);
  if(input.length >= 1){
    debouncedCharacterSearch(input);
  }
})

document.addEventListener("DOMContentLoaded", function() {
  fetch(`https://swapi.py4e.com/api/people`).then(response => response.json()).then(data => {
    console.log(data);
    if (data.count >= 1) {
      displayCharacters(data.results);
    } else {
      displayError();
    }
  }).catch(e => {
    console.log(e);
    //results.innerText = "The characters you seek are not here";
     displayError();
  })
})


async function searchForCharacter(query) {
	const characterData = await fetch(`https://swapi.py4e.com/api/people?search=${query}`).then(resp => resp.json());
	console.log(characterData);
  if (characterData.count >= 1) {
    displayCharacters(characterData.results)
  } else {
    displayError()
  }
}
const debouncedCharacterSearch = debounce(searchForCharacter, 500);


function displayCharacters(characters){
  // const listOfCharacterNames = characters.map(character => {
  //   return `<li>${character.name}</li>`
  // }).join(" ");
  // results.innerHTML = `<ul class="characters">${listOfCharacterNames}</ul>`;

  // We are going to add an a tag to each list item
  const listOfNames = characters.map(character => {
  return `<li><a data-url="${character.url}">${character.name}</a></li>`
  }).join(" ")
  results.innerHTML = `<ul class="characters">${listOfNames}</ul>`;

  // Get all the characters in the Characters list (as created above)
  const links = document.querySelectorAll('.characters a');

  // For each link, lets add an event listener that listens for the click event.
  links.forEach(link => {
    link.addEventListener('click', () => {
      const characterUrl = link.getAttribute('data-url');
      console.log(characterUrl);
      openCharacterDialog(characterUrl);
    });
  });
}

function openCharacterDialog(characterApiUrl) {
  // Open the dialog
  dialog.showModal();

  // Fetch and display data
  fetch(characterApiUrl).then(resp => resp.json()).then(data => {
    console.log("Character data from fetch:", data);  // Fetch and display data
    characterTitle.innerText = data.name;

    // Adding the character data as HTML dynamically
    dialogContent.innerHTML = `
     <p><strong>Height:</strong> ${data.height}</p>
     <p><strong>Mass:</strong> ${data.mass}</p>
     <p><strong>Gender:</strong> ${data.gender}</p>
    `;

    }).catch(err => {
      console.log(err);
      // If the fetch fails overall, then we will display this message
      //dialogContent.innerHTML = 'Failed to load data.';
       displayError()
    });

}

// Close the dialog when the close button is clicked within the dialog element
closeDialogButton.addEventListener('click', () => {
  dialog.close();
});

// Close the dialog when clicking outside of it
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});


//When the dialog closes, we reset it back to it's original state
dialog.addEventListener("close", () => {
  characterTitle.innerText = "";
  dialogContent.innerHTML = "Loading...";
})


function displayError() {
  results.innerHTML = "<ul class='characters'><li>The characters you seek are not here</li></ul>"
}


//displayCharacters:
// Runs the first one on page load (DOMContentLoaded): This fetches all characters from the Star Wars API.
// Runs the second one every time you type (input event):This makes a search request to the API using the typed input.
// Both functions call the same displayCharacters() function — the only difference is when and with what data.