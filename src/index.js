const dogURL = "http://localhost:3000/dogs"

document.addEventListener('DOMContentLoaded', () => {
  getAllDogs()
  const editForm = document.getElementById('dog-form')
  editForm.addEventListener("submit", handleSubmitEdit)

  const newForm = document.getElementById('new-dog-form')
  newForm.addEventListener("submit", handleAddDog)
})

function getAllDogs() {
  fetch(dogURL)
    .then(resp => resp.json())
    .then(dogs => {
      const tableBody = document.getElementById('table-body')
      tableBody.innerHTML = ""
      dogs.forEach(dog => {
      tableBody.innerHTML += createDogEntry(dog)
      tableBody.addEventListener("click", handleEditDog)
      tableBody.addEventListener("click", handleDeleteDog)
    })
  })
}

function getOneDog(dogId) {
  return fetch(`${dogURL}/${dogId}`)
    .then(resp => resp.json())
}

function postNewDog(dogData) {
  fetch(dogURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(dogData)
  })
    .then(resp => resp.json())
    .then(json => getAllDogs())
}

function patchDog(dogId, newDogInfo) {
  fetch(`${dogURL}/${dogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newDogInfo)
  })
    .then(resp => resp.json())
    .then(dog => getAllDogs())
}

function deleteDog(dogId) {
  fetch(`${dogURL}/${dogId}`, {
    method: 'DELETE'
  })
    .then(resp => resp.json())
    .then(json => getAllDogs())
}

function createDogEntry(dog) {
  return `
    <tr>
      <td id="dog-name">${dog.name}</td>
      <td id="dog-breed">${dog.breed}</td>
      <td id="dog-sex">${dog.sex}</td>
      <td><button id="edit-dog" data-id=${dog.id}>Edit Dog</button></td>
      <td><button id="delete-dog" data-id=${dog.id}>Delete Dog</button></td>
    </tr>
  `
}

function handleEditDog(event) {
  if(event.target.id === "edit-dog") {
    const editForm = document.querySelector('#dog-form')

    const name = editForm.querySelector('input[name="name"]')
    const breed = editForm.querySelector('input[name="breed"]')
    const sex = editForm.querySelector('input[name="sex"]')


    const dogId = event.target.dataset.id
    getOneDog(dogId).then(dog => {
      name.value = dog.name
      breed.value = dog.breed
      sex.value = dog.sex

      editForm.dataset.dogId = dog.id
    })
  }
}

function handleSubmitEdit(event) {
  event.preventDefault()

  const dogId = event.target.dataset.dogId
  const dogForm = document.getElementById('dog-form')

  let newName = document.querySelector('input[name="name"]').value
  let newBreed = document.querySelector('input[name="breed"]').value
  let newSex = document.querySelector('input[name="sex"]').value

  const newDogInfo = {
    name: newName,
    breed: newBreed,
    sex: newSex
  }

  patchDog(dogId, newDogInfo)
  dogForm.reset()
}


function handleDeleteDog(event) {
  if(event.target.id === "delete-dog") {
    const dogId = event.target.dataset.id
    deleteDog(dogId)
  }
}

function handleAddDog(event) {
  event.preventDefault()

  const newForm = document.querySelector('#new-dog-form')

  const dogName = document.querySelector('input[name="newName"]').value
  const dogBreed = document.querySelector('input[name="newBreed"]').value
  const dogSex = document.querySelector('input[name="newSex"]').value

  const dogData = {
    name: dogName,
    breed: dogBreed,
    sex: dogSex
  }

  postNewDog(dogData)
  newForm.reset()
}







//
