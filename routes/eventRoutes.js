const express = require("express");
const router = express.Router();
const db = require("../db/mysql");
const verifyJWT = require("./verifyJWT");

router.use(verifyJWT());

router.post("/", (req, res) => {
  const { event_content, status } = req.body;
  const user_id = req.user.id;

  const createEventQuery = `INSERT INTO events (user_id ,event_content ,status) VALUES (?,?,?) `;
  db.query(
    createEventQuery,
    [user_id, event_content, status],
    (err, results) => {
      if (err) {
        res.status(400).json({ message: "創建失敗" });
        return;
      }

      res.status(200).json({
        message: "創建成功",
        event: { id: results.insertId, event_content, status },
      });
    }
  );
});

router.get("/", (req, res) => {
  const user_id = req.user.id;
  const { status } = req.query;
  let eventStatus = "未完成";
  if (status == "all") {
    eventStatus = null;
  } else if (status) {
    eventStatus = status;
  }
  const getEventsQuery = eventStatus
    ? `SELECT * FROM events WHERE user_id = ? AND status = ?`
    : `SELECT * FROM events WHERE user_id = ?`;

  db.query(
    getEventsQuery,
    eventStatus ? [user_id, eventStatus] : [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "查询失败", error: err });
      }
      res.json({ events: results });
      // res.render("index", { events: results || [] }); // 确保 events 至少是一个空数组
    }
  );
});

router.delete("/:eventId", (req, res) => {
  const user_id = req.user.id;
  const id = req.params.eventId;
  const delQuery = "DELETE FROM events WHERE user_id = ? AND id = ?";
  db.query(delQuery, [user_id, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: "刪除錯誤: ",
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "找不到要刪除的事件" });
    }
    res
      .status(200)
      .json({ message: "刪除成功", deletedRows: result.affectedRows });
  });
});

router.put("/", (req, res) => {
  const user_id = req.user.id;
  const { eventid, eventStatus } = req.body;
  const putQuery = `UPDATE events SET status = ? WHERE user_id = ? AND id = ?`;
  db.query(putQuery, [eventStatus, user_id, eventid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "資料錯誤 error" });
    }
    res.json({ message: "成功更新", event: result });
  });
});

module.exports = router;
