// adaptor from slide fns (asyncMap, chain)
// to async fns

module.exports.chain = chain

var bindActor = require("slide").bindActor
  , async = require("async")

function chain (arr, cb) {
    var newArr = []

    arr.forEach(function (actor) {
      if (Array.isArray(actor)) {
        actor = bindActor.apply(null, actor)
      }
      if (actor) newArr.push(actor)
    })

    async.series(newArr, cb)
}
