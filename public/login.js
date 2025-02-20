$("#login").on("submit", function (event) {
  event.preventDefault();
  const user = $("#login").serialize();
  $.ajax({
    type: "POST",
    url: "/user/login/",
    data: user,
    success: function (response) {
      console.log("成功" + response);
      localStorage.setItem("token", `Bearer ${response.token}`);
    },
    error: function (error) {
      console.log("失敗" + error);
    },
  });
});
