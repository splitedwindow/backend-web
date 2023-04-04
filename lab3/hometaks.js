const fs = require("fs");

// get the file data
let scenario = fs.readFileSync("./scenario.txt");
scenario = scenario.toString();
let characters_count = 0;

// getting all the characters
const result = scenario
  // .match(new RegExp("^[A-Z][a-z]+:", "gm"))
  .match(/^[A-Z][a-z]+:/gm);

let characters = [];
result.forEach((characterName) => {
  if (!characters.includes(characterName.slice(0, -1))) {
    characters_count++;
    characters.push(
      //  characterName.replace(':', '')
      //  characterName.slice(0, characterName.length - 1)
      characterName.slice(0, -1)
    );
  }
});


let replicas = [];

// console.log(scenario);

{
  let a = scenario;
  const res = {};
  const b = [...a.matchAll(/^(Triss|Geralt|Max|Yennefer):/gim)];

  // console.log(b);
  for (let i = 0; i < b.length; i += 1) {
    const match = b[i];
    // console.log("match:", match);
    const [_1, characterName] = match;
    const { index } = match;
    if (res[characterName]) {
      res[characterName].push({
        start: index,
        end: b[i + 1] ? b[i + 1].index : -1,
      });
    } else {
      res[characterName] = [
        {
          start: index,
          end: b[i + 1] ? b[i + 1].index : -1,
        },
      ];
    }
  }


  array_of_names = [];
  count_of_names = 0;
  current_name = "nothing";
  for (let i = 0; true; i++) { // stupid function I could just .length
    current_name = Object.keys(res)[i];

    if (!current_name) break;
    count_of_names++;
    array_of_names[i] = current_name;
  }
  

  for (let i = 0; i < count_of_names; i++) {
    current_name = array_of_names[i];
    scenario_copy = scenario;
    let characterReplicas = "";
    replicas_of_character_object = res[array_of_names[i]];

    for (let m = 0; replicas_of_character_object[m]; m++) {

      let current_replica_with_name = scenario_copy.slice(
        replicas_of_character_object[m]["start"],
        replicas_of_character_object[m]["end"]
      );

      let name_length = array_of_names[i].length;
      current_replica_without_name = current_replica_with_name.slice(name_length+2, -1) + '\n'; //check later
      characterReplicas = characterReplicas + current_replica_without_name;
    }

    let file_path = './replicas/' + current_name + '.txt';
    let file_name = current_name + '.txt';

    fs.writeFile(file_path, characterReplicas, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  }

  // console.log(res['Max'][0]['end'])
}
