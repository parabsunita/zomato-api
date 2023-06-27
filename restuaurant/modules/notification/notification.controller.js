const Notification = require("../../../models/notification.model");
async function addNotification(req, res) {
  const { title, body, image_url, topic, delivery_date, delivery_status } =
    req.body;
  newnotification = {
    title,
    body,
    image_url,
    topic,
    delivery_date,
    delivery_status,
  };
  const notification = Notification.create(newnotification);

  res.send({
    error: false,
    notification: notification,
  });
}
async function getNotification(req, res) {
  const notifications = await Notification.find();
  res.send({
    error: false,
    notification: notifications,
  });
}
module.exports = { getNotification, addNotification };
