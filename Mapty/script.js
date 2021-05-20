'use strict';

class Workout {
  ///only works in future JS, for older JS add date and id to constructor function
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}.`;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////////////////
///////Application architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  //create private properties to adjust later on in code
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];
  constructor() {
    //loading the map when new app is created
    this._getPosition();

    //get data from localstorage
    this._getLocalStorage();

    ///bind this keyword otherwise it points to form
    form.addEventListener('submit', this._newWorkout.bind(this));
    ////listen to when cyclinc is selected
    inputType.addEventListener('change', this._toggleElevationField);
    ///add event listener to form elements, so when you click it you move to the location on map
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
  _getPosition() {
    //check if it exists, for old browsers
    if (navigator.geolocation) {
      //two functions, first when there is a succes. Second one is when it doesnt work
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    //same as const latitude = position.coords.latitude
    const { longitude } = position.coords;

    const coords = [latitude, longitude];
    ///load external library from leafet
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    ///use on method from the leaflet library
    //handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
    ///getting the marker, normally in get local storage
    ///put here because otherwise map isnt loaded yet when rendering marker
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    //save the evnt to use outside of this scope
    this.#mapEvent = mapE;
    //remove hidden class for form when clicked
    form.classList.remove('hidden');
    //cursor goes to this field on form
    inputDistance.focus();
  }
  _hideForm() {
    //emtpy inputs
    inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value =
      '';
    //add hidden class
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _toggleElevationField() {
    ///select closest parent
    //toggle, means change from hidden to visible or other way around
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    ///helper function that takes in an array of values to check if all values are numbers
    //every value only returns true if all are true
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPostive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();
    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //if acitvity is running, create running
    if (type === 'running') {
      //check if data is valid
      const cadence = +inputCadence.value;
      ///check each value if it is a number, if one isnt alert
      if (
        !validInputs(distance, duration, cadence) ||
        !allPostive(distance, duration, cadence)
      )
        return alert('Input have to be positive numbers');
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //if cycling, create cycling
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPostive(distance, duration)
      )
        return alert('Input have to be positive numbers');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    //add new object to workout array
    this.#workouts.push(workout);

    //render workout as map on marker
    this._renderWorkoutMarker(workout);
    //render workout on list
    this._renderWorkout(workout);
    ///display marker when submitted

    //take the coordinates from the mapevent when clicked

    //hide form + clear inputfields
    this._hideForm();
    //Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}${workout.description}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = ` <li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === 'running') {
      html += `
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
    </li>`;
    }
    if (workout.type === 'cycling') {
      html += ` 
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');

    //if clicked outside this element you get null, gaurd clause to ignore
    if (!workoutEl) return;
    //scan the arrays of workouts for a workout with the same id as the dataset id
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    ///leaflet method to move to coords on the map
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }
  _setLocalStorage() {
    //first argument in method is key, second is value
    //convervting object to string with JSON.stringify
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    //parsing an object/array from string
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    //setting workout array to data saved in storage
    this.#workouts = data;
    ///rendering workout for each workout
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  /// public method to clear local storage
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}
///loading the app object the first time to start the map
const app = new App();

////codewars
