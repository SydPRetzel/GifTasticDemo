$(document).ready(function () {

    // GLOBALS
    var TIMEOUT_MS = 1; // Pause the code execution for window to render.
    var NUM_GIF_COLS = 5; // Number of columns in display.
    var GIF_LIMIT = 10; // Number of GIFs to display per query.
    var gifCounter = 0; // Counter so that we can tie in card elements associated with a single GIF.

    // Initial array of topics
    var topics = [{ name: "Football", type: "gif", page: 0 },
    { name: "Soccer", type: "gif", page: 0 },
    { name: "Hockey", type: "gif", page: 0 },
    { name: "Tennis", type: "gif", page: 0 },
    { name: "Batman", type: "movie" },
    { name: "Harry Potter", type: "movie" },
    { name: "Star Wars", type: "movie" }];

    // Function to initialize and get things started.
    function initialize() {

        // Add in the columns.
        $("#gifViewRow").empty();
        for (var i = 0; i < NUM_GIF_COLS; i++) {
            var newCol = $("<div>");
            var colId = "gifCardCol" + i;
            //console.log("Adding col : " + colId);
            newCol.attr("id", colId);
            newCol.addClass("col-md-2 custom-col");

            $("#gifViewRow").append(newCol);
        }

        // This function handles events where the Add Topic button is clicked
        $("#add-topic").on("click", function (event) {
            // event.preventDefault() prevents the form from trying to submit itself.
            // We're using a form so that the user can hit enter instead of clicking the button if they want
            event.preventDefault();

            // This line will grab the text from the input box
            var name = $("#topic-input").val().trim();
            var type = "gif";
            var newTopic = { name: name, type: type, page: 0 };

            // Do not add an empty button.
            if (name !== "") {
                // The topic from the textbox is then added to our array
                topics.push(newTopic);

                // calling renderButtons which handles the processing of our topic array
                renderButtons();
            }
            else {
                // Complain about empty text.
                setTimeout(function () { alert("Empty text cannot be used."); }, TIMEOUT_MS);
            }

        });

        // This function handles events where the Add Movie button is clicked
        $("#add-movie").on("click", function (event) {
            // event.preventDefault() prevents the form from trying to submit itself.
            // We're using a form so that the user can hit enter instead of clicking the button if they want
            event.preventDefault();

            // This line will grab the text from the input box
            var name = $("#topic-input").val().trim();
            var type = "movie";
            var newTopic = { name: name, type: type };

            // Do not add an empty button.
            if (name !== "") {
                // The topic from the textbox is then added to our array
                topics.push(newTopic);

                // calling renderButtons which handles the processing of our topic array
                renderButtons();
            }
            else {
                // Complain about empty text.
                setTimeout(function () { alert("Empty text cannot be used."); }, TIMEOUT_MS);
            }

        });


        // Render the buttons.
        renderButtons();
    }
    // Function for displaying topic data
    function renderButtons() {

        // Deleting the topic buttons prior to adding new topic buttons
        $("#buttonsView").empty();

        // Looping through the array of topics
        for (var i = 0; i < topics.length; i++) {

            // Then dynamicaly generating buttons for each topic in the array.
            // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
            var a = $("<button>");
            // Get the name of the button
            var name = topics[i].name;
            // Get the type of the button
            var type = topics[i].type;

            if (type === "gif") {
                // Adding a class
                a.addClass("btn btn-primary topic");
                // Page number
                var page = topics[i].page;
                a.attr("page", "" + page);
            }
            else if (type === "movie") {
                // Adding a class
                a.addClass("btn btn-warning topic");
            }
            // Add type attribute
            a.attr("data-type", type);
            // Adding a data-attribute with a value of the topic at index i
            a.attr("data-name", name);
            // Add an id so we can find the array index it came from
            a.attr("id", i);
            // Providing the button's text with a value of the topic at index i
            a.text(name);
            // Adding the button to the HTML
            $("#buttonsView").append(a);

        }

        // This function handles events where a topic button is clicked
        $(".topic").on("click", function () {

            // Check whether buttons need to be deleted.
            var deleteButtons = false;
            if ($('#deleteButtonCheckbox').is(':checked')) {
                deleteButtons = true;
            }

            // Get the button data type.
            var dataType = $(this).attr("data-type");
            // Get contents.
            if (deleteButtons === false) {
                var dataName = $(this).attr("data-name");
                if (dataType === "gif") {
                    var page = parseInt($(this).attr("page"));
                    getGIFs(dataName, page);
                    // Increment page offset for next time.
                    page += GIF_LIMIT;
                    $(this).attr("page", page);
                }
                else if (dataType === "movie") {
                    getMovies(dataName);
                }
            }

            // Delete the button.
            //console.log(deleteButtons);
            if (deleteButtons === true) {
                console.log("index : " + $(this).attr("id"));
                var arrayIndex = parseInt($(this).attr("id"));
                // Remove that element.
                topics.splice(arrayIndex, 1);

                renderButtons();
            }




        });
    }

    // Get the GIFs and display them.
    function getGIFs(dataName, page) {

        var api_key = "YyVpePGv4I8Z6AqCLgop7tWvMwuUdOR6";
        var currentTopic = dataName;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + currentTopic + "&api_key=" + api_key +
            "&offset=" + page + "&rating=g&limit=10";

        console.log(queryURL);

        // Issue ajax call.
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {

                console.log(response);
                var results = response.data;
                //console.log(results.length);

                // Get rid of old gifs if overwrite is checked.
                if ($('#gifOverwriteCheckbox').is(':checked')) {
                    for (var i = 0; i < NUM_GIF_COLS; i++) {
                        $("#gifCardCol" + i).empty();
                    }

                    // Re-init the gif counter.
                    gifCounter = 0;
                }

                console.log(results);

                for (var i = 0; i < results.length; i++) {

                    var colId = "#gifCardCol" + (i % NUM_GIF_COLS);
                    console.log(colId);

                    // Generate a new card.
                    var newGifCard = $("<div>");
                    newGifCard.addClass("card rounded custom-card");
                    newGifCard.attr("id", "gifCard" + gifCounter);

                    // Generate a new card image.
                    var newGifCardImage = $("<img>");
                    newGifCardImage.addClass("card-img-top custom-card-img-top");
                    newGifCardImage.attr("id", "gifCardImage" + gifCounter);

                    // Generate a new card body.
                    var newGifCardBody = $("<div>");
                    newGifCardBody.addClass("card-body custom-gif-card-body");
                    newGifCardBody.attr("id", "gifCardBody" + gifCounter);

                    // Append the card body and card image to the new card.
                    newGifCard.append(newGifCardImage);
                    newGifCard.append(newGifCardBody);
                    $(colId).append(newGifCard);

                    // Populate the card with the results data.
                    var stillImageURL = results[i].images.fixed_height_still.url;
                    var animatedImageURL = results[i].images.fixed_height.url;
                    newGifCardImage.attr("src", stillImageURL);
                    // Add the still and looping urls to attributes.
                    newGifCardImage.attr("still-image", stillImageURL);
                    newGifCardImage.attr("animated-image", animatedImageURL);
                    // Add the state.
                    newGifCardImage.attr("image-state", "still");
                    newGifCardImage.addClass("gif-button"+gifCounter);

                    // Add title.
                    var title = results[i].title;
                    var newCardText = $("<h6>");
                    newCardText.text("Title: " + title);
                    newCardText.addClass("card-text");
                    newGifCardBody.append(newCardText);

                    var rating = results[i].rating;
                    newCardText = $("<h6>");
                    newCardText.text("Rating: " + rating.toUpperCase());
                    newCardText.addClass("card-text");
                    newGifCardBody.append(newCardText);

                    // Add a button to remove the card.
                    newGifCardBody.append(createCardRemoveButton(gifCounter));

                    // Bind the callback for the gif button click.
                    $(".gif-button"+gifCounter).on("click",gifButtonCallback);

                    // NOTE : This does not work as expected.  It just opens the GIF in the current page.
                    //        So I commented it out.
                    // Add a link to click on to download the GIF.
                    /*
                    var downloadLink = $("<a>");
                    downloadLink.attr("href",animatedImageURL);
                    //downloadLink.attr("target","_blank");
                    downloadLink.attr("download");
                    downloadLink.text("Download");
                    newGifCardBody.append(downloadLink);
                    */

                    // Increment gif card counter.
                    gifCounter++;
                }

                // Bind the remove button callbacks.
                bindCardRemoveButtonCallback();

            });
    }

    // Function for .gif-button? class callback.
    function gifButtonCallback() {

        // Get the current state of the image.
        var currentState = $(this).attr("image-state");
        if (currentState === "still") {
            $(this).attr("image-state", "animated");
            $(this).attr("src", $(this).attr("animated-image"));
        } else {
            $(this).attr("image-state", "still");
            $(this).attr("src", $(this).attr("still-image"));
        }
    }

    // Get the Movies and display them.
    function getMovies(dataName) {

        var currentTopic = dataName;
        var queryURL = "https://www.omdbapi.com/?s=" + currentTopic + "&plot=short&apikey=trilogy";

        console.log(queryURL);

        // Issue ajax call.
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {

                console.log(response);
                var results = response.Search;
                //console.log(results.length);

                // Get rid of old gifs if overwrite is checked.
                if ($('#gifOverwriteCheckbox').is(':checked')) {
                    for (var i = 0; i < NUM_GIF_COLS; i++) {
                        $("#gifCardCol" + i).empty();
                    }

                    // Re-init the gif counter.
                    gifCounter = 0;
                }

                // if (false) {
                console.log(results);

                for (var i = 0; i < results.length; i++) {

                    var colId = "#gifCardCol" + (i % NUM_GIF_COLS);
                    //console.log(colId);

                    // Generate a new card.
                    var newGifCard = $("<div>");
                    newGifCard.addClass("card rounded custom-card");
                    newGifCard.attr("id", "gifCard" + gifCounter);

                    // Generate a new card image.
                    var newGifCardImage = $("<img>");
                    newGifCardImage.addClass("card-img-top custom-card-img-top");
                    newGifCardImage.attr("id", "gifCardImage" + gifCounter);
                    newGifCardImage.attr("onError", "this.onerror=null;this.src='./assets/images/no-image.png';");

                    // Generate a new card body.
                    var newGifCardBody = $("<div>");
                    newGifCardBody.addClass("card-body custom-movie-card-body");
                    newGifCardBody.attr("id", "gifCardBody" + gifCounter);

                    // Append the card body and card image to the new card.
                    newGifCard.append(newGifCardImage);
                    newGifCard.append(newGifCardBody);
                    $(colId).append(newGifCard);

                    // Populate the card with the results data.
                    var posterImage = results[i].Poster;
                    newGifCardImage.attr("src", posterImage);

                    // Add title.
                    var title = results[i].Title;
                    var newCardText = $("<h6>");
                    newCardText.text("Title: " + title);
                    newCardText.addClass("card-text");
                    newGifCardBody.append(newCardText);

                    var year = results[i].Year;
                    newCardText = $("<h6>");
                    newCardText.text("Year: " + year);
                    newCardText.addClass("card-text");
                    newGifCardBody.append(newCardText);

                    // Add a button to remove the card.
                    newGifCardBody.append(createCardRemoveButton(gifCounter));

                    // Increment gif card counter.
                    gifCounter++;
                }

                // Bind the remove button callbacks.
                bindCardRemoveButtonCallback();

            });
    }

    // Add a button to remove the card.
    function createCardRemoveButton(_gifCounter) {
        var newRemoveButton = $("<button>");
        newRemoveButton.addClass("btn btn-danger custom-remove-button");
        newRemoveButton.attr("id", "gifCardRemoveButton" + _gifCounter);
        var newSpan = $("<span>");
        //newSpan.addClass("fas fa-trash-alt");
        newSpan.addClass("icon");
        newRemoveButton.append(newSpan);
        //newRemoveButton.text("X");
        //newRemoveButton.html("&#xf014");
        //<span class="icon"></span>
        return newRemoveButton;
    }

    // Bind the custom-remove-button class callback.
    function bindCardRemoveButtonCallback() {
        $(".custom-remove-button").on("click", function () {
            //console.log($(this));
            // Get the gif counter value associated with this button.
            var buttonId = $(this).attr("id");
            var gifId = parseInt(buttonId.split("gifCardRemoveButton")[1]);
            // Get the parent card.
            var cardId = "gifCard" + gifId;
            $("#" + cardId).remove();
        })
    }


    // KICK OFF!
    initialize();

})