const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function deploy() {
  const { stdout: output1 } = await exec("npm install");
  console.log("Installing dependencies...");
  console.log(output1);

  const { stdout: output2 } = await exec("npm db:migrate");
  console.log("Migrating database...");
  console.log(output2);

  const { stdout: output3 } = await exec("npm db:seed");
  console.log("Seeding...");
  console.log(output3);
}

deploy();