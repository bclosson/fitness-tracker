const router = require("express").Router();

// DASHBOARD ROUTE
router.get("/", (req, res) => {
  res.json({
    error: null,
    data: {
      title: "My dashboard",
      content: "Dashboard content",
      user: req.user, // token payload information
    },
  });
});

// SHOW ROUTE
// router.get("/:userId", (req, res) => {
//   User.findById(req.params.userId)
//     .populate("workouts")
//     .exec((err, foundUser) => {
//       if (err) return console.log(err);
//       const context = {
//         user: foundUser,
//       };
//       res.render("dashboard/show", context);
//     });
// });

module.exports = router;
