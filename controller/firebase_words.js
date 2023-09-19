const Word = require("../models/Words");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getWords = asyncHandler(async (req, res, next) => {
  // console.log(req.query);
  // console.log(req.query.limit);
  // console.log(typeof (req.query.page - 1) * req.query.limit);
  // console.log((req.query.page - 1) * req.query.limit);
  const data = await req.db
    .collection("word")
    // .orderBy('en')
    // .startAt(100)
    // .limit(50)
    .get();

  let response = [];

  data.forEach((el) => {
    response.push(el.data());
  });

  console.log(response.length);

  res.status(200).json({
    success: true,
    data: response,
    code: res.statusCode,
    // pagination: { ...pagination, countSaveWord },
  });
});

// exports.getWord = asyncHandler(async (req, res, next) => {
//   const word = await Word.findById(req.params.id).populate("category");

//   if (!word) {
//     throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
//   }

//   res.status(200).json({
//     success: true,
//     data: word,
//     code: res.statusCode,
//   });
// });

exports.createWord = asyncHandler(async (req, res, next) => {
  let batch = req.db.batch();

  req.body.forEach((doc) => {
    var docRef = req.db.collection("word").doc(); //automatically generate unique id
    batch.set(docRef, doc);
  });
  // const response = await req.db.collection("word").add(req.body);

  await batch.commit();

  res.status(200).json({
    success: true,
    data: null,
    code: res.statusCode,
  });
});

exports.updateWord = asyncHandler(async (req, res, next) => {
  // await req.db
  //   .collection("word")
  //   .where("id", "==", req.params.id)
  //   .update({ saved: true });

  await req.db
    .collection("word")
    .where("id", "==", req.params.id)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        doc.ref.update({ saved: req.body[0].saved == "true" ? true : false }); //not doc.update({foo: "bar"})
      });
    });

  res.status(200).json({
    success: true,
    data: null,
    code: res.statusCode,
  });
});

// exports.deleteWord = asyncHandler(async (req, res, next) => {
//   let word = await Word.deleteOne({ _id: req.params.id });

//   res.status(200).json({
//     success: true,
//     data: word,
//     code: res.statusCode,
//   });
// });

// exports.updateSaveWord = asyncHandler(async (req, res, next) => {
//   // const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
//   //   new: true,
//   //   runValidators: true,
//   // });

//   // if (!word) {
//   //   throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
//   // }

//   // let bulk = Word.initializeUnorderedBulkOp();

//   // req.body.forEach((word) =>
//   //   bulk.find({ id: word.id }).update({ $set: { saved: word.saved } })
//   // );

//   // bulk.execute();

//   req.body.forEach(async (word) => {
//     await Word.findByIdAndUpdate(
//       word.id,
//       { saved: word.saved },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   });

//   res.status(200).json({
//     success: true,
//     // data: word,
//     code: res.statusCode,
//   });
// });

// exports.allClear = asyncHandler(async (req, res, next) => {
//   let words = await Word.updateMany({}, { saved: false });

//   res.status(200).json({
//     success: true,
//     data: words,
//     code: res.statusCode,
//   });
// });

// // let data = await Word.deleteMany({
// //   category: ["64737a5b0e98236faf0ec88e"],
// // });
