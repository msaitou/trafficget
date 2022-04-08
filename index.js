// DBから取得したデータをファイル名にしてデスクトップに作る。
const logger = require("./initter.js").log();
global.log = logger;
logger.info("start!");
logger.info(process.argv);
const db = require("./initter.js").db;
const fs = require("fs");
const conf = require("config");
const dateFormat = import("dateformat");
// import dateFormat from "dateformat";

async function start() {
  return new Promise(async (resolve, reject) => {
    // db
    let recs = await db("life_util", "find", {});
    let fileList = fs.readdirSync(conf.traffic.path);

    // ファイル名を作成
    for (let i = 0; i < recs.length; i++) {
      // ファイル名の先頭が、コードから始まってるやつは先に消す。
      let oldFile = fileList.filter((f) => f.indexOf(recs[i].code) === 0)[0];
      if (oldFile) {
        logger.info(oldFile);
        fs.unlinkSync(`${conf.traffic.path}/${oldFile}`);
      }
      let modDate = new Date(recs[i].date);
      let strModDate = (await dateFormat).default(modDate, "mmdd h:MM"); // returns 'Tuesday, March 16th, 2021, 11:32:08 PM'
      let fileName = recs[i].disp_mess;
      let abFilePath = `${conf.traffic.path}/${fileName} ${strModDate}`;
      fs.writeFileSync(abFilePath, "");
    }
    logger.info(33);
    resolve(true);
  })
    .then((res) => {
      logger.info("res", res);
    })
    .catch((e) => {
      logger.error(e);
    })
    .finally(() => {
      logger.info("tyokuzen");
      process.exit();
    });
}
start();

// モードの並列実行が可能か。可能ではない場合、終わりを検知できる必要があり、できない場合、起動タイミングは終了タイミングを予測し猶予する必要がある。
// プロセスに名前をつけて、チェック可能にし、終了するまで。もしくは、終了させてから実行するような仕組みにしたい。

// また、vaiosaito側では、DBから必要な情報を取得して、デスクトップにファイルを作成するみたいなシェルを作りたい。

// log書くやつとdriverとDBの読み書きは独立クラス
// logを表示するwebアプリを作る。
