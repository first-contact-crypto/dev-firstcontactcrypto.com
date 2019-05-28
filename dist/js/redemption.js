
const BADGR_ISSUER_ID = "rGy5MNWtQgSs1vfnLyPlmg";
const BADGR_ACCESS_TOKEN = "irLWj7bSsXb2Ln4vsTooyFSfSmwOSG";
const BADGR_COURSE_TYPE = "course";
const BADGR_EPIPHANY_TYPE = "epiphany";
const BADGR_REDEMPTION_TYPE = "redemption";
const BADGR_BASE_URL = "https://api.badgr.io/";
const BADGR_SERVER_SLUG_EPIPHANY = "V_MaSinhQJeKGOtZz6tDAQ";
const BADGR_SERVER_SLUG_REDEMPTION = "XrG4QUcyTQGVch1VipS-Qw";


var BADGR_BADGECLASS_SINGLE_ISSUER_PATH = "v2/issuers/{0}/badgeclasses"       // issuer id
var BADGR_ASSERTION_BADGECLASS_PATH = "v2/badgeclasses/{0}/assertions";            // badge_class entityId
var BADGR_ASSERTION_ISSUER_PATH = "v2/issuers/{0}/assertions";


var recipient = new Object();
recipient.identity = "string";
recipient.type = "email";
recipient.hashed = true;
recipient.plaintextIdentity = "string";

        // EPIPHANY BADGE SERVER SLUG: V_MaSinhQJeKGOtZz6tDAQ
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_efc20af1 - 7d43 - 4d1e - 877e-447244ea3fd3.png

        // COURSE BADGE SERVER SLUG: 2gnNK3RZSlOutOrVeQlD_A
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_63237c1a - 3f3d - 40b7 - 9e48 - 085658d2799f.png

        // REDEMPTION BADGE SERVER SLUG: XrG4QUcyTQGVch1VipS-Qw
        // IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_41b742a0 - d58c - 4223 - bffb - f2bc92fdd4bf.png


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
  window.username = vars.username;
  window.useremail = vars.useremail;
  window.epiphany_badgeclass_id = vars.epiphany_badgeclass_id;
  window.epiphany_issuer_id = vars.epiphany_issuer_id;
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function getUrlVars() {
        // pc_pkg = {
        //   num_epiph_asserts: 0,
        //   num_course_asserts: 0,
        //   epiphany_badgeclass_id: "",
        //   username: "",
        //   useremail: ""
        // };
  var pc_pkg = JSON.parse(findGetParameter("pc_pkg_str"));

  var vars = {
    num_epiph_asserts: 5,
    epiphany_badgeclass_id: pc_pkg.epiphany_badgeclass_id,
    epiphany_issuer_id: "rGy5MNWtQgSs1vfnLyPlmg",
    username: pc_pkg.username,
    useremail: pc_pkg.useremail
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

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    } else {
      print("What the {0}", "FUCK! ..here I am")
    }
  };
  xhttp.open("GET", BADGR_BASE_URL + format(BADGR_BADGECLASS_SINGLE_ISSUER_PATH, "rGy5MNWtQgSs1vfnLyPlmg"));
  xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
  xhttp.send();
}


function getAssertions() {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      ret = JSON.parse(this.responseText)
      document.getElementById("demo").innerHTML = this.responseText;
    //   document.getElementById("demo").innerHTML = window.useremail;
    } else {
      console.log("WHAT THE FUCK: " + this.status + " " + this.responseText);
    }
  };

  var params = "recipient=peter.alexander@prodatalab.com"

  xhttp.open("GET", BADGR_BASE_URL + format(BADGR_ASSERTION_ISSUER_PATH, BADGR_ISSUER_ID) + "?" + params);
  xhttp.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
  xhttp.send();
}



function displayUserInfo() {
  document.getElementById("demo").innerHTML = window.username + ";" + window.useremail + ";" + window.epiphany_issuer_id + ";" + window.epiphany_badgeclass_id;
}




getUrlVars();
displayUsersInfo();