$(document).ready(() => {
  var apiURL = `http://${window.location.hostname}:8000/api/v1/places`;
  let AllRecords = document.querySelector(".listOfPlaces");
  var foundPlaces = document.getElementById("closePlaces").innerHTML;
  var template = Handlebars.compile(foundPlaces);
  let categories = [];
  let catMap = {};
  let allData = null;
  let placesObj = {};

  function AppViewmodel() {
    var self = this;
    self.categories = ko.observable();
    self.place = ko.observable();
    self.matches = ko.observable();

    //get all the places that are stored in the database
    $.ajax({
      url: apiURL,
      type: "GET",
      success: (data) => {
        // caching the data for easy access
        allData = data.places;
        AllRecords.innerHTML = template({
          place: allData
        })
        allData.map((place) => {
          (placesObj[place.Name] === undefined) ? placesObj[place.Name] = null: false;
          if (catMap[place.Category] === undefined) {
            catMap[place.Category] = null;
            categories.push(place.Category.split("_").join(" "));
          }
        });
        $('input.autocomplete').autocomplete({
          data: placesObj,
          limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: function (val) {
            // Callback function when value is autcompleted.
          },
          minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
        self.categories(categories);
      }
    });

    self.search = () => {
      var matches = [];
      let placeName = $('#pac-input').val();
      if (placeName.trim().length != 0) {
        allData.map((place) => {
          if (placeName.toLowerCase() === place.Name.toLowerCase()) {
            matches.push(place);
          }
        })
        AllRecords.innerHTML = template({
          place: matches
        });
        return;
      } else {
        Materialize.toast("please enter valid place", 2000);
      }
      console.log('found...', matches);
      AllRecords.innerHTML = template({
        place: allData
      })
    }

  };

  ko.applyBindings(new AppViewmodel());

})