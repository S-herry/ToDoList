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
$("#addEvent").click(() => {
  const event_content = $("#event_content").val();
  const status = "未完成";
  const token = localStorage.getItem("token");
  $.ajax({
    type: "POST",
    data: { event_content, status },
    headers: {
      Authorization: token, // 添加 Authorization 头部
    },
    url: "/events",
    success: (response) => {
      $("#event_content").val(""); // 清空 id 为 event_content 的输入框的值
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        // timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "新增成功",
      });
    },
    error: (response) => {
      window.location.href = "/";
    },
  });
});

$("#allEvents").click(() => {
  const token = localStorage.getItem("token");

  $.ajax({
    type: "GET",
    headers: {
      Authorization: token, // 添加 Authorization 头部
    },
    url: "/events?status=all", // 查询所有状态的事件
    success: (event) => {
      loadEvents(event.events, token);
    },
  });
});
$("#waitEvents").click(() => {
  const token = localStorage.getItem("token");

  $.ajax({
    type: "GET",
    url: "/events?status=未完成", // 查询未完成的事件
    headers: {
      Authorization: token,
    },
    success: (event) => {
      loadEvents(event.events, token);
    },
    error: (response) => {
      window.location.href = "/";
    },
  });
});
$("#finishEvents").click(() => {
  const token = localStorage.getItem("token");

  $.ajax({
    type: "GET",
    url: "/events?status=已完成", // 查询已完成的事件
    headers: {
      Authorization: token,
    },
    success: (event) => {
      loadEvents(event.events, token);
    },
    error: (response) => {
      window.location.href = "/";
    },
  });
});
function loadEvents(events, token) {
  const eventList = $("#events");
  eventList.empty(); // 清空

  events.forEach((event) => {
    const li = $(`
      <li class="event border rounded-md p-4 flex">
          <input type="checkbox" class="basis-1/6 checkbox-fixed my-auto"  ${
            event.status === "已完成" ? "checked" : ""
          } id="event${event.id}" />

        <label for="event${event.id}" class="basis-4/6 my-auto">
          ${event.event_content}
        </label>
        <div class="basis-1/6 my-auto text-center  ">
        <button class="ml-2 del-btn cursor-pointer text-white bg-red-500 hover:bg-red-700 font-bold  rounded-md">
          X
        </button>
        </div>
      </li>
    `);

    eventList.append(li);

    li.find(".del-btn").on("click", function () {
      $.ajax({
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        type: "DELETE",
        url: `/events/${event.id}`,
        success: () => {
          li.remove(); // 删除该事件项
        },
        error: (response) => {
          window.location.href = "/";
        },
      });
    });
  });
}

$("#allEvents, #waitEvents, #finishEvents").click(function () {
  $("#allEvents, #waitEvents, #finishEvents").removeClass("border-gray-800");
  $(this).addClass("border-gray-800");
});
