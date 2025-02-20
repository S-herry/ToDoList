$("#register").on("submit", (event) => {
  event.preventDefault();
  let data = $("#register").serialize(); //  URL 編碼數據

  $.ajax({
    type: "POST",
    url: "/user/register",
    data: data,
    dataType: "JSON",
    success: function (response) {
      $("#errorMessage").text("");
      window.location.href = "http://localhost:3000/";
    },
    error: function (err) {
      $("#errorMessage").text(err.responseJSON.message);
    },
  });
});
