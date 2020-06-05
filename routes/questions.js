const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/new", (req, res) => {
  console.log(db);
  console.log(req.body);
  db.sequelize.models.Question.create({ question: req.body.question }).then(
    (ques) => {
      //console.log(ques);
      i = 0;
      while (i < req.body.options.length) {
        db.sequelize.models.Options.create({
          options: req.body.options[i].option,
        }).then((opts) => {
          //console.log(opts);
          db.sequelize.models.QueOpts.create({
            QuestionId: ques.id,
            OptionId: opts.id,
          }).then((qos) => {
            console.log(qos);
            j = 0;
            while (j < req.body.tags.length) {
              db.sequelize.models.Tag.create({
                tag: req.body.tags[j].tag,
              }).then(async (tag) => {
                console.log(tag);
                await db.sequelize.models.QuestionSet.create({
                  TagId: tag.id,
                  QueOptId: qos.id,
                });
              });
              j += 1;
            }
          });
        });
        i += 1;
      }
      res.send(ques);
    }
  );
});

router.get("/all", (req, res) => {
  db.sequelize.models.Question.findAll({
    attributes: ["question"],
    include: {
      model: db.sequelize.models.QueOpts,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.sequelize.models.Tag,
          attributes: { exclude: ["QuestionSet", "createdAt", "updatedAt"] },
        },
        {
          model: db.sequelize.models.Options,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    },
  }).then((ans) => {
    res.send(ans);
  });
});

router.get("/tag", (req, res) => {
  const search = req.body.search;
  db.sequelize.models.Question.findAll({
    attributes: ["question"],
    include: {
      model: db.sequelize.models.QueOpts,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.sequelize.models.Tag,
          where: {
            tag: search,
          },
          attributes: { exclude: ["QuestionSet", "createdAt", "updatedAt"] },
        },
        {
          model: db.sequelize.models.Options,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    },
  }).then((ans) => {
    ans = ans.filter((item) => {
      if (item.QueOpts.length > 0) {
        return true;
      }
    });
    res.send(ans);
  });
});

router.get("/:id", (req, res) => {
  db.sequelize.models.Question.findAll({
    where: {
      id: req.params.id,
    },
    attributes: ["question", "id"],
    include: {
      model: db.sequelize.models.QueOpts,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.sequelize.models.Tag,
          attributes: { exclude: ["QuestionSet", "createdAt", "updatedAt"] },
        },
        {
          model: db.sequelize.models.Options,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    },
  }).then((ans) => {
    res.send(ans);
  });
});

module.exports = router;
