const core = require('@actions/core');

const findDuplicates = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) !== index);

class service {
  constructor(repo, version) {
    this.repo = repo;
    this.version = version;
  }
}

const new_images = core.getInput("new");

const old_images = core.getInput('old');

const new_str_set = [...new Set(new_images.trim().split('\n'))];
const old_str_set = [...new Set(old_images.trim().split('\n'))];
const new_mod_arr = new_str_set.map(
  (image) =>
    new service(
      image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf(':')),
      image.substring(image.lastIndexOf(':') + 1)
    )
);
const old_mod_arr = old_str_set.map(
  (image) =>
    new service(
      image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf(':')),
      image.substring(image.lastIndexOf(':') + 1)
    )
);
const repos = new_mod_arr.map((a) => a.repo);
if (findDuplicates(repos))
  core.error('duplicated versions of ' + findDuplicates(repos).toString());

let changes_str = "";
new_mod_arr.forEach(service => {
    let i = old_mod_arr.findIndex((image) => image.repo === service.repo);
    if (i >= 0 && old_mod_arr[i].version !== service.version)
        changes_str += service.repo + ': ' + old_mod_arr[i].version + ' -> ' + service.version + '\n';
});

core.setOutput("changed", changes_str);
