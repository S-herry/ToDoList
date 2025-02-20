$("#plusEvent").click(function () {
  console.log("param");
});

$("#allEvents, #waitEvents, #finishEvents").click(function () {
  $("#allEvents, #waitEvents, #finishEvents").removeClass("border-gray-800"); // 先移除所有
  $(this).addClass("border-gray-800"); // 再添加當前點擊的
});

$(document).ready(function () {
  const token = localStorage.getItem("token");

  $.ajax({
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // 传递 JWT 令牌
    },
    type: "GET",
    url: "/",
    success: function (response) {
      console.log("✅ 服务器响应:", response);
    },
  });
});
