import { verifyAuth } from "#verifyAuth";

export const get = [
  verifyAuth(["instructor", "dispatcher", "manager"]),
  (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        suspended: req.user.suspended,
        accountType: req.user.accountType,
      },
    });
  },
];
