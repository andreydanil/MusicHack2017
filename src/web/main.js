// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var response = "";
var colors = "";

var CV_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + window.apiKey;

$(function () {
  $('#fileform').on('submit', uploadFiles);
});

function clearResults() {
  document.getElementById("results").style.display = "none";
}

function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#uploadImg')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

function imageToSound() {
  $('#myModal').modal('toggle');
  document.getElementById("title").innerHTML = "Fetching Sound";

  

  //document.getElementById("spinner").style.display = "none";
}
/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles (event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile (event) {
  var content = event.target.result;
  sendFileToCloudVision(content.replace('data:image/jpeg;base64,', ''));
}

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision (content) {
  //var type = $('#fileform [name=type]').val();

  var type = "IMAGE_PROPERTIES";
  var type1 = "LABEL_DETECTION";

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: type,
        maxResults: 200
      }]
    }]
  };

  var request1 = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: type1,
        maxResults: 200
      }]
    }]
  };

  $('#results').text('Loading...');
  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
    response = data;
  }).done(displayJSON);

  $('#resultsColor').text('Loading...');
  $.post({
    url: CV_URL,
    data: JSON.stringify(request1),
    contentType: 'application/json'
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
    colors = data;
  }).done(displayColorJSON);
}

/**
 * Displays the results.
 */
function displayJSON (data) {
  var contents = JSON.stringify(data, null, 4);
  $('#results').text(contents);
  var evt = new Event('results-displayed');
  response = data;
  evt.results = contents;
  document.dispatchEvent(evt);
}

function displayColorJSON (data) {
  var contents = JSON.stringify(data, null, 4);
  $('#resultsColor').text(contents);
  var evt = new Event('results-displayed');
  colors = data;
  evt.results = contents;
  document.dispatchEvent(evt);
  document.getElementById("spinner").style.display = "none";
}
