$("#register").on("submit", (event) => {
  event.preventDefault();
  let data = $("#register").serialize(); //  URL 編碼數據
  $.ajax({
    type: "POST",
    url: "/user/register",
    data: data,
    dataType: "JSON",
    success: function (response) {
      console.log("註冊成功", response);
    },
    error: function (err) {
      console.log("註冊失敗", err);
    },
  });
});
