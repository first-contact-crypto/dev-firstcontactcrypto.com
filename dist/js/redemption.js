
const BADGR_ISSUER_ID = "";
const BADGR_COURSE_TYPE = "course";
const BADGR_EPIPHANY_TYPE = "epiphany";
const BADGR_REDEMPTION_TYPE = "redemption";

var BADGR_BASE_URL = "https://api.badgr.io/";
var BADGR_BADGECLASS_SINGLE_ISSUER_PATH = "v2/issuers/{0}/badgeclasses"       // issuer id
var BADGR_ASSERTION_BADGECLASS_PATH = "v2/badgeclasses/{0}/assertions";            // badge_class entityId
var BADGR_ASSERTION_ISSUER_PATH = "v2/issuers/{0}/assertions";

var recipient = new Object();
recipient.identity = "string";
recipient.type = "email";
recipient.hashed = true;
recipient.plaintextIdentity = "string";


// UTITLITIES

function format(fmt, ...args) {
  // retstr = format("blah: {0}", "the_var")
  // https://coderwall.com/p/flonoa/simple-string-format-in-javascript <BOTTOM OF THE PAGE>
  if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
    throw new Error("invalid format string.");
  }
  return fmt.replace(
    /((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g,
    (m, str, index) => {
      if (str) {
        return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
      } else {
        if (index >= args.length) {
          throw new Error("argument index is out of range in format");
        }
        return args[index];
      }
    }
  );
}

function print(fmt, ...args) {
  // Use this for debug statements;
  console.log(format(fmt, ...args));
}



function setVarsGlobally(vars) {
  window.username = vars["username"];
  window.useremail = vars["useremail"];
  window.num_epiph_asserts = vars["num_epiph_asserts"];
  window.epiphany_badgeclass_id = vars["epiphany_badgeclass_id"];
  window.epiphany_issuer_id = vars["epiphany_issuer_id"];
}

function getUrlVars() {
        // pc_pkg = {
        //   num_epiph_asserts: 0,
        //   num_course_asserts: 0,
        //   epiphany_badgeclass_id: "",
        //   username: "",
        //   useremail: ""
        // };
  var vars = {
    num_epiph_asserts: 5,
    epiphany_badgeclass_id: "",
    epiphany_issuer_id: "rGy5MNWtQgSs1vfnLyPlmg",
    username: "admin",
    useremail: "peter.alexander@prodatalab.com"
  };
  // var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
  //   vars[key] = value;
  // });
  // if (isEmpty(vars) == false) {
  //   setVarsGlobally(JSON.parse(vars['pc_pkg_str']));
  // }
  if (isEmpty(vars) == false) {
    setVarsGlobally(vars);
  }
  else {
    print("What the {0} ..blah de blah", "FUCK!")
  }
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


function getBadgeClasses() {
  // https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp
  //   return makeHttpRequest(BADGR_BADGECLASS_SINGLE_ISSUER_PATH, "GET");
  var xhttp = new XMLHttpRequest();
  // "Authorization: Bearer Z2iZwHMpQtOZtueS4mSNAuz6AmQMZX";
  // {
  // "badgr_access_token": "hJPjyjIiIpiCiaCsBkZEkM3Su4rc1R",
  // "badgr_refresh_token": "2Yur56qYRfGH7K8zZMbkGvgRA6Aq3E"
  // } 

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    } else {
      print("What the {0}", "FUCK! ..here I am")
    }
  };
  xhttp.open("GET", BADGR_BASE_URL + format(BADGR_BADGECLASS_SINGLE_ISSUER_PATH, "rGy5MNWtQgSs1vfnLyPlmg"));
  xhttp.setRequestHeader("Authorization", "Bearer irLWj7bSsXb2Ln4vsTooyFSfSmwOSG");
  xhttp.send();
}


        // data = {
        //     'recipient': {
        //         'identity': uname,
        //         'type': 'email',
        //         'hashed': False,
        //         'plaintextIdentity': ptid
        //     }
        // }




function getAssertions() {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      ret = JSON.parse(this.responseText)
      // document.getElementById("demo").innerHTML = ret.result[0].recipient.identity;
      document.getElementById("demo").innerHTML = window.useremail;
    } else {
      console.log("WHAT THE FUCK: " + this.status + " " + this.responseText);
    }
  };

  var params = "recipient=peter.alexander@prodatalab.com"

  xhttp.open("GET", BADGR_BASE_URL + format(BADGR_ASSERTION_ISSUER_PATH, window.epiphany_issuer_id) + "?" + params);
  xhttp.setRequestHeader("Authorization", "Bearer irLWj7bSsXb2Ln4vsTooyFSfSmwOSG");
  xhttp.send();
}



function displayUsersInfo() {
  
}




getUrlVars();
displayUsersInfo();
