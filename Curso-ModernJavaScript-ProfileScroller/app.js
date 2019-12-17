const data = [
    {
        name: 'Jhon Doe',
        age: 32,
        gender: 'Male',
        lookingFor: 'Female',
        location: 'Boston MA',
        image: 'https://randomuser.me/api/portraits/men/82.jpg'
    },
    {
        name: 'Jhen Smith',
        age: 37,
        gender: 'Female',
        lookingFor: 'male',
        location: 'Boston MA',
        image: 'https://randomuser.me/api/portraits/women/82.jpg'
    },
    {
        name: 'Willian Dow',
        age: 32,
        gender: 'Male',
        lookingFor: 'Female',
        location: 'Boston MA',
        image: 'https://randomuser.me/api/portraits/men/8.jpg'
    },
]

const profiles = profileIterator(data);

const nextItem = document.getElementById('next');
nextItem.addEventListener("click", nextProfile);

nextProfile();

function nextProfile() {
    const profileDisplay = document.getElementById('profileDisplay');
    const currentProfile = profiles.next().value;

    console.log(currentProfile);
    if (currentProfile !== undefined) {
        profileDisplay.innerHTML = `
            <ul class="list-group">
                <li class="list-group-item">Name: ${currentProfile.name}</li>
                <li class="list-group-item">Age: ${currentProfile.age}</li>
                <li class="list-group-item">Location: ${currentProfile.location}</li>
                <li class="list-group-item">Preference: ${currentProfile.gender} looking for ${currentProfile.lookingFor}
            </ul>
        `
        const imageDisplay = document.getElementById('imageDisplay');

        imageDisplay.innerHTML = `<img src="${currentProfile.image}">`
    } else {
        window.location.reload();
    }
}

function profileIterator(profiles) {
    let nextIndex = 0;

    return {
        next: function () {
            return nextIndex < profiles.length ?
                { value: profiles[nextIndex++], done: false } :
                { done: true }
        }
    }
}