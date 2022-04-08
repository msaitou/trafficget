const conf = require("config");

exports.db = async function (coll, method, cond = {}, doc) {
  let log = getLogInstance();
  log.info(0);
  const mdb = require("mongodb");
  //   global.db = db;
  log.info(1);
  const dbClient = mdb.MongoClient;
  log.info(2);
  try {
    log.info("conf", conf);
    let db = await dbClient.connect(`mongodb://${conf.db.host}/`);
    log.info(3);
    const dbName = db.db("sm");
    const collection = dbName.collection(coll);
    let res;
    log.info(4);
    switch (method) {
      case "find":
        res = await collection.find(cond).toArray();
        break;
      case "findOne":
        res = await collection.findOne(cond);
        break;
      case "update":
        let cnt = 0;
        if (cond) {
          cnt = await collection.find(cond).count();
        }
        if (cnt) {
          res = await collection.updateOne(cond, { $set: doc });
        } else {
          // insert
          res = await collection.insertOne(doc);
        }
        break;
      case "remove":
      default:
    }
    log.info(5);
    // log.info(lines);
    db.close();
    return res;
  } catch (e) {
    throw e;
  }
};
function getLogInstance() {
  return global.log ? global.log : thisLog();
}

/** ログクラスの初期処理
 * @returns
 */
const thisLog = () => {
  const log = require("log4js");
  log.configure({
    appenders: {
      out: { type: "stdout" },
      app: { type: "dateFile", filename: "log/a.log", pattern: "yyyyMMdd", keepFileExt: true },
    },
    categories: { default: { appenders: ["out", "app"], level: "all" } },
  });
  const logger = log.getLogger();
  logger.level = "all";
  return logger;
};
exports.log = thisLog;

