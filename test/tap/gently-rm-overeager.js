var resolve = require("path").resolve
var fs = require("graceful-fs")
var test = require("tap").test
var mkdirp = require("mkdirp")
var rimraf = require("rimraf")

var common = require("../common-tap.js")

var pkg = resolve(__dirname, "gently-rm-overeager")
var dep = resolve(__dirname, "test-whoops")

var EXEC_OPTS = {
  cwd : pkg
}

test("setup", function (t) {
  nuke()
  bootstrap()
  t.end()
})

test("cache add", function (t) {
  common.npm(["install", "../test-whoops"], EXEC_OPTS, function (er, c) {
    t.ifError(er, "test-whoops install didn't explode")
    t.ok(c, "test-whoops install also failed")
    fs.readdir(pkg, function (er, files) {
      t.ifError(er, "package directory is still there")
      t.same(files, [], "only debug log remains")
      t.end()
    })
  })
})

test("cleanup", function (t) {
  nuke()

  t.end()
})


var fixture = {
  name: "@test/whoops",
  version: "1.0.0",
  scripts: {
    postinstall: "echo \"nope\" && exit 1"
  }
}

function nuke () {
  rimraf.sync(pkg)
  rimraf.sync(dep)
}

function bootstrap () {
  mkdirp.sync(pkg)
  // so it doesn't try to install into npm's own node_modules
  mkdirp.sync(resolve(pkg, "node_modules"))
  mkdirp.sync(dep)
  fs.writeFileSync(resolve(dep, "package.json"), JSON.stringify(fixture))
}
