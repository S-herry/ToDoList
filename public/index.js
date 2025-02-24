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
      Authorization: token,
    },
    url: "/events",
    success: (response) => {
      $("#event_content").val("");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "新增成功",
      });

      const eventId = response.event?.id || response.id; // 确保获取正确的 ID
      const newEvent = $(`
        <li class="event border rounded-md p-4 flex">
          <input type="checkbox" class="basis-1/6 checkbox-fixed my-auto" id="event-${eventId}" />
          <label for="event-${eventId}" class="basis-4/6 my-auto">
            ${response.event?.event_content || event_content}
          </label>
          <div class="basis-1/6 my-auto text-center">
            <button class="ml-2 del-btn cursor-pointer text-white bg-red-500 hover:bg-red-700 font-bold rounded-md">
              X
            </button>
          </div>
        </li>
      `);

      $("#unfinished-list").prepend(newEvent);
      const clonedEvent = newEvent.clone();
      $("#all-events").prepend(clonedEvent);

      // 处理删除事件
      function bindDeleteEvent(element) {
        element.find(".del-btn").on("click", function () {
          $.ajax({
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            type: "DELETE",
            url: `/events/${eventId}`,
            success: () => {
              element.remove();
            },
            error: (err) => {
              console.log(err);
            },
          });
        });
      }

      // 处理完成状态切换
      function bindStatusChangeEvent(element) {
        element.find("input").on("change", function () {
          const checked = this.checked;
          $.ajax({
            type: "PUT",
            url: "/events",
            headers: {
              Authorization: token,
            },
            data: {
              eventStatus: checked ? "已完成" : "未完成",
              eventid: eventId,
            },
            success: () => {
              element.find("label").toggleClass("line-through", checked);
            },
            error: (err) => {
              console.log(err);
            },
          });
        });
      }

      // 绑定事件
      bindDeleteEvent(newEvent);
      bindStatusChangeEvent(newEvent);
      bindDeleteEvent(clonedEvent);
      bindStatusChangeEvent(clonedEvent);
    },
    error: (err) => {
      console.log(err);
    },
  });
});

$("#allEvents").click(() => {
  const token = localStorage.getItem("token");

  $.ajax({
    type: "GET",
    headers: {
      Authorization: token,
    },
    url: "/events?status=all",
    success: (event) => {
      loadEvents(event.events, token, "all");
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
      loadEvents(event.events, token, "未完成");
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
    url: "/events?status=已完成",
    headers: {
      Authorization: token,
    },
    success: (event) => {
      loadEvents(event.events, token, "已完成");
    },
    error: (response) => {
      window.location.href = "/";
    },
  });
});

function loadEvents(events, token, get) {
  $("#all-events, #unfinished-list, #finished-list").addClass("hidden");

  let eventList = $("#all-events");
  if (get === "未完成") {
    eventList = $("#unfinished-list");
  } else if (get === "已完成") {
    eventList = $("#finished-list");
  }
  eventList.removeClass("hidden");

  events.forEach((event) => {
    if (!event || typeof event !== "object") {
      console.error("event  數據無效:", event);
      return;
    }

    const li = $(`
      <li class="event border rounded-md p-4 flex">
          <input type="checkbox" class="basis-1/6 checkbox-fixed my-auto"  id="event${event.id}" />
        <label for="event${event.id}" class="basis-4/6 my-auto" >
          ${event.event_content}</label> 
          <div class="basis-1/6 my-auto text-center  ">
        <button class="ml-2 del-btn cursor-pointer text-white bg-red-500 hover:bg-red-700 font-bold  rounded-md">
          X
        </button>
        </div>
      </li>
    `);
    if (event.status === "已完成") {
      li.find("label").addClass("line-through");
      li.find("input").prop("checked", true);
    } else {
      li.find("input").prop("checked", false);
    }

    eventList.append(li);
    li.find("input").on("change", function () {
      if (this.checked) {
        $.ajax({
          type: "PUT",
          url: "/events",
          headers: {
            Authorization: token,
          },
          data: {
            eventStatus: "已完成",
            eventid: event.id,
          },
          success: function (response) {
            li.find("label").addClass(" line-through ");
            if (get !== "all") li.remove();
          },
        });
      } else {
        $.ajax({
          type: "PUT",
          url: "/events",
          headers: {
            Authorization: token,
          },
          data: {
            eventStatus: "未完成",
            eventid: event.id,
          },
          success: function (response) {
            li.find("label").removeClass(" line-through ");
            if (get !== "all") li.remove();
          },
        });
      }
    });
    li.find(".del-btn").on("click", function () {
      $.ajax({
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        type: "DELETE",
        url: `/events/${event.id}`,
        success: () => {
          li.remove();
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  });
}

$("#allEvents, #waitEvents, #finishEvents").click(function () {
  $("#allEvents, #waitEvents, #finishEvents").removeClass("border-gray-800");
  $("#unfinished-list, #finished-list, #all-events").addClass("hidden");

  $(this).addClass("border-gray-800");
  if ($(this).attr("id") === "allEvents") {
    $("#all-events").removeClass("hidden");
    $("#all-events").empty();
  } else if ($(this).attr("id") === "waitEvents") {
    $("#unfinished-list").removeClass("hidden");
    $("#unfinished-list").empty();
  } else {
    $("#finished-list").removeClass("hidden");
    $("#finished-list").empty();
  }
});
