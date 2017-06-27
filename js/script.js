function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So you want to live in ' + address + '!!!!');

    var url = "https://maps.googleapis.com/maps/api/streetview?size=600x500&location=" + address + "";
    $body.append("<img class='bgimg' src='" + url + "'>");

    /* Requesting the Jason data from the NY times */
    var nyUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyUrl += "?" + $.param({
        'api-key': "56a2af43838b463aaf5ec4933ff6d9d1",
        'q': streetStr + ", " + cityStr,
        'page' : 2
    });

    $.getJSON(nyUrl, function (data) {
        $("#nytimes-header").text("New Yor Times Artilces for " + cityStr);
        var json = JSON.stringify(data); // converting the object into JSON
        var receivedData = data.response.docs;
        console.log("No of items recevied are : " + receivedData.length);
        if (receivedData.length !== 0) {
            $('.msg').remove();
            for (var i = 0; i < receivedData.length; i++) {
                var title = receivedData[i].headline.main;
                var link = receivedData[i].web_url;
                var detail = receivedData[i].snippet;

                var listItem = "<li>";
                listItem += "<a href=" + link + " class='link' target='_blank'>" + title + "</a>"
                listItem += "<p>" + detail + "</p></li>"
                $("#nytimes-articles:last").append(listItem);
            }
        } else {
            var noContent = "<h4 class='msg'> No content available </h4>";
            $("#nytimes-header").after(noContent);
        }
    }).error(function () {
        $("#nytimes-header").text("New Yor Times Artilces could not be loaded");
    });

    // Ajax call for Wikipedia

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallBack";
    
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("Failed to load the content from wikipedia!!!");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function (dataFromWikipedia) {
            console.log(dataFromWikipedia);
            var json = JSON.stringify(dataFromWikipedia);
            var snippet = dataFromWikipedia[1];
            var links = dataFromWikipedia[3];

            if (dataFromWikipedia.length !== 0) {
                $('.msg').remove();
                for (var i = 0; i < snippet.length; i++) {
                    var string = "<li>";
                    string += "<a href='" + links[i] + "' target='_blank'>" + snippet[i] + "</a></li>";

                    $("#wikipedia-links:last").append(string);
                }
            } else {
                var noContent = "<h4 class='msg'> No content available </h4>";
                $("#wikipedia-header").after(noContent);
            }
            
            clearTimeout(wikiRequestTimeout);
        }
    });

    /* Checking the input field contains value or not */
    if (streetStr !== "" && cityStr !== "") {
        return false;
    } else {
        return true;
        alert("Kindly enter the mentioned fields.");
    }

};

$('#form-container').submit(loadData);