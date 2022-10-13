import prompt from "prompt";


const adminModel =  [
  {
    name:"username",
    description: 'Enter your username',
    validator: /^[a-zA-Z\s-]+$/,
    warning: 'Username must be only letters, spaces, or dashes',
    required:true,
    type:"string",
  },
  {
    name:"password",
    description: 'Enter your password',
    hidden: true,
    required : true,
    replace: "*"
  }
];
prompt.start();

prompt.get(adminModel, function (err, result) {
  if (err) {
    return onErr(err);
  }

  const {username, password} = result;


});

function onErr(err) {
  console.log(err);
  return 1;
}