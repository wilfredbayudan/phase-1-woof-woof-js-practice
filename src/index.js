document.addEventListener('DOMContentLoaded', () => {
  const dbUrl = 'http://localhost:3000/pups';

  // Functions

  function fetchPups() {
    return fetch(dbUrl)
      .then(res => res.json())
      .then(data => {
        let pupsArray = [];
        data.forEach(pup => pupsArray.push(pup))
        return pupsArray;
      })
      .catch(err => console.log(err));
  }

  function renderPups(array) {
    const dogBar = document.getElementById('dog-bar');
    // Reset dogBar
    dogBar.textContent = '';

    array.forEach(dog => {
      const span = document.createElement('span');
      span.textContent = dog.name;
      span.addEventListener('click', () => renderMoreInfo(dog.id, dog.name, dog.isGoodDog, dog.image))
      dogBar.appendChild(span);
    })
  }

  function renderMoreInfo(id, name, isGoodDog, image) {
    const dogInfo = document.getElementById('dog-info');
    // Reset dogInfo
    dogInfo.textContent = '';

    const img = document.createElement('img');
    img.src = image;
    dogInfo.appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = name;
    dogInfo.appendChild(h2);

    const btn = document.createElement('button');
    btn.textContent = isGoodDog ? 'Bad Dog!' : 'Good Dog!';
    btn.addEventListener('click', () => {
      toggleIsGood(id, !isGoodDog);
    })
    
    dogInfo.appendChild(btn);
  }

  function toggleIsGood(id, update) {
    const newStatus = !!update;
    const patchConfig = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "isGoodDog": newStatus
      })
    }
    fetch(`${dbUrl}/${id}`, patchConfig)
      .then(res => res.json())
      .then(data => {
        // Re-render More Info Section
        renderMoreInfo(data.id, data.name, data.isGoodDog, data.image);
        // Re-render Dog Bar
        renderDogBar();
      })
      .catch(err => console.log(err))
  }

  // Filter stuff
  let filter = false;

  const btnFilter = document.getElementById('good-dog-filter');
  btnFilter.addEventListener('click', toggleFilter)

  function toggleFilter() {
    const filterBtnText = "Filter good dogs: " + (filter ? 'OFF' : 'ON');
    btnFilter.textContent = filterBtnText;
    filter = !filter;
    console.log(`Filter now ${filter}`)
    renderDogBar();
  }

  function renderDogBar() {
    fetchPups()
    .then(res => {
      if (filter) {
        const goodDogs = res.filter(pup => pup.isGoodDog);
        renderPups(goodDogs);
      } else {
        renderPups(res)
      }
    })
    .catch(err => console.log(err))
  }


  // Run

  renderDogBar();

})