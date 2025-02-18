$("#plusEvent").click(function () {
  console.log("param");
});

$("#allEvents, #waitEvents, #finishEvents").click(function () {
  $("#allEvents, #waitEvents, #finishEvents").removeClass("border-gray-800"); // 先移除所有
  $(this).addClass("border-gray-800"); // 再添加當前點擊的
});
