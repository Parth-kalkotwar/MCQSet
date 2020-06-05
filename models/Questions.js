module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("Tag", { tag: DataTypes.STRING });
  const Options = sequelize.define("Options", { options: DataTypes.STRING });
  const Question = sequelize.define("Question", { question: DataTypes.STRING });

  const QueOpts = sequelize.define("QueOpts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  });
  Question.belongsToMany(Options, { through: QueOpts });
  Options.belongsToMany(Question, { through: QueOpts });
  QueOpts.belongsTo(Question);
  QueOpts.belongsTo(Options);
  Question.hasMany(QueOpts);
  Options.hasMany(QueOpts);

  const QuestionSet = sequelize.define("QuestionSet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  });
  Tag.belongsToMany(QueOpts, { through: QuestionSet });
  QueOpts.belongsToMany(Tag, { through: QuestionSet });
  QuestionSet.belongsTo(Tag);
  QuestionSet.belongsTo(QueOpts);
  Tag.hasMany(QuestionSet);
  QueOpts.hasMany(QuestionSet);

  return { Question, Options, Tag, QueOpts, QuestionSet };
};
