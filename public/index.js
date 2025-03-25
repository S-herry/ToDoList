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
      window.location.reload();
    },
  });
});
$("#toRegister").click(() => {
  window.location.href = "/user/register";
});
$("#toLogin").click(() => {
  window.location.href = "/user/login";
});
// 修改狀態
function bindStatusChangeEvent(element, eventId) {
  element.find("input").on("change", function () {
    const checked = this.checked;
    const token = localStorage.getItem("token");
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
        const ul = element.closest("ul");
        const ul_id = ul[0].id;
        if (ul_id != "all-events") element.remove();
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
}
// 刪除事件
function bindDeleteEvent(element, eventId) {
  const token = localStorage.getItem("token");

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
// 取得事件
function getCurrentState(newState) {
  const token = localStorage.getItem("token");
  const state = newState == 0 ? "未完成" : newState == 1 ? "已完成" : "all";

  $.ajax({
    type: "GET",
    url: `/events?status=${state}`,
    headers: {
      Authorization: token,
    },
    success: (event) => {
      loadEvents(event.events, state);
    },
    error: () => {
      window.location.reload();
    },
  });
}
// 新增事件
function addNewEvent() {
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

      const eventId = response.event?.id || response.id;
      const newEvent = li(response.event);

      $("#unfinished-list").prepend(newEvent);
      const clonedEvent = newEvent.clone();
      $("#all-events").prepend(clonedEvent);

      // 绑定事件
      bindDeleteEvent(newEvent, eventId);
      bindStatusChangeEvent(newEvent, eventId);
      bindDeleteEvent(clonedEvent, eventId);
      bindStatusChangeEvent(clonedEvent, eventId);
    },
    error: (err) => {
      window.location.reload();
    },
  });
}

$("#addEvent").click(() => addNewEvent());
$("#allEvents").click(() => getCurrentState(2));
$("#waitEvents").click(() => getCurrentState(0));
$("#finishEvents").click(() => getCurrentState(1));

function li(event) {
  return $(`
    <li class="event border rounded-md p-4 flex">
      <input type="checkbox" class="basis-1/6 checkbox-fixed my-auto" id="event${event.id}" />
      <label for="event${event.id}" class="basis-4/6 my-auto">${event.event_content}</label>
      <div class="basis-1/6 my-auto text-center">
        <button class="ml-2 del-btn cursor-pointer text-white hover:bg-red-100 font-bold rounded-md">
          <img src="/delEventIcon.png"  />
        </button>
      </div>
    </li>
  `);
}

function loadEvents(events, get) {
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
      console.error("event 數據無效:", event);
      return;
    }
    const liElement = li(event);

    if (event.status === "已完成") {
      liElement.find("label").addClass("line-through");
      liElement.find("input").prop("checked", true);
    } else {
      liElement.find("input").prop("checked", false);
    }

    bindStatusChangeEvent(liElement, event.id);
    bindDeleteEvent(liElement, event.id);

    eventList.append(liElement);
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
