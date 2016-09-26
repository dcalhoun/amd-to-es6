"use strict";

const tap = require("tap");
const fs = require("fs");
const shell = require("shelljs");
const path = require("path");

tap.test("it should be possible to convert a file through cli", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var args = "test/fixture/cli/single-file/input.js";
    var output = fs.readFileSync(path.join(__dirname, "../../fixture/cli/single-file/output.js"), "utf8");
    var result = shell.exec(`node ${bin} ${args}`, { silent: true });
    t.ok(output === result.stdout);
    t.end();

});

tap.test("it should be possible to convert multiple files within a directory", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var src = "test/fixture/cli/multiple-files/inputs";
    var glob = "*.js";
    var dest = "test/fixture/cli/multiple-files/outputs";
    var args = `--src=${src} --glob=${glob} --dest=${dest}`;
    var result = shell.exec(`node ${bin} ${args}`, { silent: true });
    var input1 = path.join(__dirname, "../../../", dest, "input1.js");
    var input2 = path.join(__dirname, "../../../", dest, "input2.js");
    var output1 = path.join(__dirname, "../../../", dest, "output1.js");
    var output2 = path.join(__dirname, "../../../", dest, "output2.js");
    var content1 = fs.readFileSync(input1, "utf8");
    var content2 = fs.readFileSync(input2, "utf8");
    var result1 = fs.readFileSync(output1, "utf8");
    var result2 = fs.readFileSync(output2, "utf8");
    t.ok(content1 === result1);
    t.ok(content2 === result2);
    fs.unlinkSync(input1);
    fs.unlinkSync(input2);
    t.end();

});

tap.test("it should be possible to convert multiple files recursively", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var src = "test/fixture/cli/multiple-files-recursive/inputs";
    var glob = "**/*.js";
    var dest = "test/fixture/cli/multiple-files-recursive/outputs";
    var args = `--src=${src} --glob=${glob} --dest=${dest}`;
    var result = shell.exec(`node ${bin} ${args}`, { silent: true });
    var input1 = path.join(__dirname, "../../../", dest, "input1.js");
    var input2 = path.join(__dirname, "../../../", dest, "dir/input2.js");
    var output1 = path.join(__dirname, "../../../", dest, "output1.js");
    var output2 = path.join(__dirname, "../../../", dest, "dir/output2.js");
    var content1 = fs.readFileSync(input1, "utf8");
    var content2 = fs.readFileSync(input2, "utf8");
    var result1 = fs.readFileSync(output1, "utf8");
    var result2 = fs.readFileSync(output2, "utf8");
    t.ok(content1 === result1);
    t.ok(content2 === result2);
    fs.unlinkSync(input1);
    fs.unlinkSync(input2);
    t.end();

});

tap.test("should be possible to replace given file with a compiled one", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var content = "define(function () { return 123; });";
    var src = "test/fixture/cli/input.js";
    var filepath = path.join(__dirname, "../../../", src);
    fs.writeFileSync(filepath, content);
    var result = shell.exec(`node ${bin} ${src} --replace`, { silent: true });
    var output = fs.readFileSync(filepath, "utf8");
    t.ok(result.stdout === output);
    fs.unlinkSync(filepath);
    t.end();

});

tap.test("should be possible to replace given files within a directory", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var dir = "test/fixture/cli/replace-files";
    var dirpath = path.join(__dirname, "../../../", dir); 
    fs.mkdirSync(dirpath);
    var content = "define(function () { return 712; });";
    var src = "test/fixture/cli/replace-files/input.js";
    var filepath = path.join(__dirname, "../../../", src);
    fs.writeFileSync(filepath, content);
    var result = shell.exec(`node ${bin} --src=${dirpath} --replace`, { silent: true });
    var output = fs.readFileSync(filepath, "utf8");
    t.ok(result.code === 0);
    t.ok(output === "export default 712;");
    fs.unlinkSync(filepath);
    fs.rmdirSync(dirpath);
    t.end();

});

tap.test("it should throw an error if dest is not provided", function (t) {

    var bin = path.join(__dirname, "../../../bin/cli.js");
    var result = shell.exec(`node ${bin} --src=hello`, { silent: true });
    t.ok(result.code === 1);
    t.end();

});