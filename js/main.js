(function init() {
  $("#detailed-information-view").hide();

  $("input[name='title']").on("keyup", function (e) {
    if (e.which === 13) {
      sendGetForm($("input[name='title']").val(), "?s=");
    }
  });
})();

function sendGetForm(title, searchType) {
  var url = "http://omdbapi.com/"+ searchType + title;
  $.ajax({
    type: "get",
    url: url,
    dataType: 'json'
  })
  .done(function (data) {
    if (data.Search !== undefined) {
      searchIndexView(data);
    }else if (data.Title !== undefined) {
      $("input[name='title']").val("");
      detailedInformationView(data);
    }else {
      $("#movie-list").append("<p>No Data Found</p>");
    }
  })
  .fail(function () {
    throw("request failed");
  });
}

function detailedInformationView(data) {
  $("#search-index-view").hide();
  $("#detailed-information-view").fadeIn();

  $("#img-frame").append( "<img src='"+ data.Poster +"'/>" );
  $("#detailed-text").append( "<h2>"+ data.Title +"</h2>" );
  $("#detailed-text").append( "<h3>("+ data.Year +")</h3>" );
  var details = ["Rated","Plot","Genre","Actors","Writers"];
  for (var i = 0; i < details.length; i++) {
    $("#detailed-text").append( "<p><strong>"+details[i]+": </strong>"+ data[details[i]] +"</p>" );
  }
}

function searchIndexView(data) {
  $("#detailed-information-view").hide();
  $("#search-index-view").fadeIn();
  $("#movie-list > *").remove();

  var movies = data.Search;
  for (var i = 0; i < movies.length; i++) {
    var movieNode = $("<h3 class='link'>" + movies[i].Title + "</h3>" ).data(movies[i]);
    $("#movie-list").append( movieNode );
  }

  $(".link").on("click", function () {
    sendGetForm($(this).data("imdbID"), "?i=");
  });
}
