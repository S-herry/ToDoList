$("#login").on("submit", function (event) {
  event.preventDefault();
  const user = $("#login").serialize();
  $.ajax({
    type: "POST",
    url: "/user/login/",
    data: user,
    success: function (response) {
      localStorage.setItem("token", `Bearer ${response.token}`);
      Swal.fire({
        title: "成功",
        icon: "success",
        draggable: true,
        timer: 2000,
        showConfirmButton: false,

        willClose: () => {
          window.location.href = "/";
        },
      });
    },
    error: function (error) {
      Swal.fire({
        title: error.responseJSON.message,
        icon: "error",
        draggable: true,
        timer: 2000,
      });
    },
  });
});
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
      window.location.href = "/user/login";
    },
    error: function (err) {
      $("#errorMessage").text(err.responseJSON.message);
    },
  });
});
$("#signout").click(() => {
  $.ajax({
    type: "get",
    url: "/user/signout",
    success: function (response) {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
  });
});
$("#toRegister").click(() => {
  window.location.href = "/user/register";
});
$("#allEvents, #waitEvents, #finishEvents").click(function () {
  $("#allEvents, #waitEvents, #finishEvents").removeClass("border-gray-800");
  $(this).addClass("border-gray-800");
});
