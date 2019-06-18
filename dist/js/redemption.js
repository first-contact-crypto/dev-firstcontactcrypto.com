const DEV_ENV = false;

// {
//   "badgr_access_token": "eQYBJeoj8MD5CNNGiW9lbhmrqoGYTz",
//   "badgr_refresh_token": "ScStrEeMla8gfXfR70Xxmm0sEW1zRY"
// }

const BADGR_ISSUER_ID = "MC67oN42TPm9VARGW7TmKw";
const BADGR_ACCESS_TOKEN = "0NEZDbBT6LEd9sP1R3GtfENBq0xifg";
const BADGR_COURSE_TYPE = "course";
const BADGR_EPIPHANY_TYPE = "epiphany";
const BADGR_REDEMPTION_TYPE = "redemption";
const BADGR_BASE_URL = "https://badgr.firstcontactcrypto.com/";
const BADGR_SERVER_SLUG_EPIPHANY = "CM-sak0wQuCty2BfSEle3A";

var BADGR_BADGECLASS_SINGLE_ISSUER_PATH = "v2/issuers/{0}/badgeclasses"; // issuer id
var BADGR_ASSERTION_BADGECLASS_PATH = "v2/badgeclasses/{0}/assertions"; // badge_class entityId
var BADGR_ASSERTION_ISSUER_PATH = "v2/issuers/{0}/assertions";
var BADGR_ASSERTION_DELETE_PATH = "v2/assertions/{0}";

// https://badgr.firstcontactcrypto.com/v2/badgeclasses/V_MaSinhQJeKGOtZz6tDAQ/assertions

var recipient = new Object();
recipient.identity = "string";
recipient.type = "email";
recipient.hashed = true;
recipient.plaintextIdentity = "string";

var badgeclasses = null;
var assertions = null;
var badgeclasses_txt = "";
var assertions_txt = "";
var prizeList = [];
var badgeclassNamesList = [];
var selectedPrize = "";
var timer_started = false;
var timer_now_time = 0;

// EPIPHANY BADGE SERVER SLUG: V_MaSinhQJeKGOtZz6tDAQ
// IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_efc20af1 - 7d43 - 4d1e - 877e-447244ea3fd3.png

// COURSE BADGE SERVER SLUG: 2gnNK3RZSlOutOrVeQlD_A
// IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_63237c1a - 3f3d - 40b7 - 9e48 - 085658d2799f.png

// REDEMPTION BADGE SERVER SLUG: XrG4QUcyTQGVch1VipS-Qw
// IMAGE: https: // media.us.badgr.io / uploads / badges / issuer_badgeclass_41b742a0 - d58c - 4223 - bffb - f2bc92fdd4bf.png

// UTITLITIES

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

function PRINT(fmt, ...args) {
  // Use this for debug statements;
  console.log(format(fmt, ...args));
}

function getJSONData(sync, url, successfunc, errorfunc) {
  console.log("INFO: In getJSONData");
  $.ajax({
    method: "GET",
    dataType: "json",
    processData: false,
    async: sync,
    contentType: "application/json",
    timeout: 3000,
    url: url,
    success: successfunc,
    error: errorfunc,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
      xhr.setRequestHeader("Content-Type", "application/json")
    }
  });
}

function setVarsGlobally(vars) {
  window.username = vars.username;
  window.useremail = vars.useremail;
  window.epiphany_badgeclass_id = vars.epiphany_badgeclass_id;
  window.epiphany_issuer_id = vars.epiphany_issuer_id;
}

function getURLParameter(parameterName) {
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
  var pc_pkg = JSON.parse(getURLParameter("pc_pkg_str"));
  var useremail = "";
  if (DEV_ENV) {
    username = "peteralexander";
    useremail = "peter.alexander@prodatalab.com";
  } else {
    useremail = pc_pkg.useremail;
    username = pc_pkg.username;
  }
  var vars = {
    // num_epiph_asserts: Object.keys(assertions).length,
    // num_epiph_asserts: pc_pkg.num_epiph_asserts,
    epiphany_badgeclass_id: BADGR_SERVER_SLUG_EPIPHANY,
    epiphany_issuer_id: "rGy5MNWtQgSs1vfnLyPlmg",
    username: username,
    useremail: useremail
  };
  setVarsGlobally(vars);
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getBadgeClasses() {
  PRINT("INFO: In getBadgeClasses");
  getJSONData(
    false,
    format(
      BADGR_BASE_URL + BADGR_BADGECLASS_SINGLE_ISSUER_PATH,
      BADGR_ISSUER_ID
    ),
    function(data, status, jqXhr) {
      // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
      window.badgeclasses = data;
      PRINT(
        "SUCCESS: In getBadgeClasses.. badgclasses are {0}",
        JSON.stringify(window.badgeclasses)
      );
    },
    function(jqXhr, textStatus, errorMessage) {
      PRINT("ERROR: In getBadgeClasses.. {0}, {1}", textStatus, errorMessage);
    }
  );
}

function getAssertions() {
  PRINT("INFO: In getAssertions");
  getJSONData(
    false,
    format(
      BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH,
      BADGR_SERVER_SLUG_EPIPHANY
    ),
    function(data, status, jqXhr) {
      // alert(format("SUCCESS.. got the badgeclasses {0}", JSON.stringify(data)));
      window.assertions = data;
      // setDevButton("Assertions", "<p>" + JSON.stringify(assertions))
      window.num_epiph_asserts = assertions.result.length;
      PRINT(
        "INFO: In getAssertions.. window.num_epiph_asserts: {0}",
        window.num_epiph_asserts
      );
    },
    function(jqXhr, textStatus, errorMessage) {
      PRINT("ERROR: In getAssertions.. {0}, {1}", textStatus, errorMessage);
    }
  );

  var num_assertions_before = assertions.result.length;
  var assertions_list = assertions.result;

  PRINT(
    "INFO: In getAssertions.. the num assertions before: {0}",
    num_assertions_before
  );

  var assertions_to_keep = []
  for (i = 0; i < num_assertions_before;++i) {
    a = assertions_list[i]
    if (a.recipient.identity === useremail) {
      assertions_to_keep.push(a)
    }
  }

  assertions.result = assertions_to_keep




  // for (i = 0; i < window.assertions.result.length; ++i) {
  //   output = []
  //   a = window.assertions.result[i];
  //   PRINT(
  //     "INFO: In getAssertions.. assertion.recipient.identity: {0} window.useremail: {1}",
  //     a.recipient.identity,
  //     window.useremail
  //   );
  //   if (a.recipient.identity != window.useremail) {
  //     // window.assertions.result.splice(i, 1);
  //     output.append
  //     --window.num_epiph_asserts
  //   }
  // }


  PRINT(
    "INFO: In getAssertions.. the num assertions after: {0}",
    assertions.result.length
  );
  window.num_epiph_asserts = window.assertions.result.length
}

function createBadge(name) {
  var badge_url = format(
    "https://badgr.firstcontactcrypto.com/v2/issuers/{0}/badgeclasses",
    BADGR_ISSUER_ID
  );
  PRINT("INFO: In createBadge.. the name is {0}, badge_url is: {1}", name, badge_url);
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: badge_url,
    data: JSON.stringify({ name: name, description: "An FCC prize category." }),
    success: function(data, status, xhr) {
      PRINT(
        "SUCCESS: In createBadge.. badge created: {0}",
        JSON.stringify(data)
      );
      badgeclasses.result.push(data)
    },
    error: function(xhr, status, errMsg) {
      PRINT(
        "ERROR: In createBadge.. badge creation failed! {0} {1}",
        status,
        errMsg
      );
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
    }
  });
}

function createBadges(name_list) {
  PRINT(
    "In createBadges.. the number of badges to create is: {0} .. {1}",
    name_list.length,
    name_list.toString()
  );
  for (var i = 0; i < name_list.length; i++) {
    createBadge(name_list[i]);
  }
  // createBadge(name_list[0])
  // getBadgeClasses();
  // testBadgesCreated();
}

// function displayUserInfo() {
//   // document.getElementById("demo").innerHTML = window.username + ";" + window.useremail + ";" + window.epiphany_issuer_id + ";" + window.epiphany_badgeclass_id;
//   document.getElementById("introductory-text").innerHTML = "Congratulations " + window.username + " You currently have " + window.num_epiph_asserts + " Epiphany Points to spend.";
// }

function displaySpendEPText() {
  console.log("In displaySpendEPText.. ");
  document.getElementById("spend-ep-text").innerHTML =
    "You currently have " +
    window.num_epiph_asserts +
    " epiphany points to spend. Each EP represents one chance to win. The more you spend the more chances you have to win!";
  document
    .getElementById("num-spent-input")
    .setAttribute("max", window.num_epiph_asserts);
}

function deleteAssertion() {
  ("In deleteAssertion");
  if (assertions.result.length == 0) {
    return 
  }
  var assertion_slug = assertions.result[0].entityId;
  PRINT("In deleteAssertion.. the assertion_slug is: {0}", assertion_slug);
  var assertion_url = format(
    BADGR_BASE_URL + BADGR_ASSERTION_DELETE_PATH,
    assertion_slug
  );

  $.ajax({
    method: "DELETE",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    data: JSON.stringify({ revocation_reason: "Epiphany Point Spent" }),
    url: assertion_url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    // data: JSON.stringify({"recipient": {"identity": useremail, "type": "email", "hashed": false, "plaintextIdentity": username}}),
    success: function(data, status, xhr) {
      PRINT(
        "SUCCESS: In deleteAssertion.. assertion deleted: {0}",
        JSON.stringify(data)
      );
      PRINT("INFO In deleteAssertion.. the assertions.size before is: {0}", assertions.result.size)
      assertions.result.shift  // removes first element
      PRINT("INFO In deleteAssertion.. the assertions.size after removal is: {0}", assertions.result.size)
    },
    error: function(xhr, status, errMsg) {
      if (xhr.status != 200) {
        PRINT(
          "ERROR: In deleteAssertion.. assertion deletion failed! {0} {1} {2}",
          xhr.status,
          status,
          errMsg
        );
      }
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
      xhr.setRequestHeader("Content-Type", "application/json");
    }
  });
}

function deleteAssertions(num) {
  PRINT("INFO: In deleteAssertions.. deleting {0}", num);
  for (i = 0; i < num; i++) {
    deleteAssertion();
    num_epiph_asserts -= 1;
    // sleep(500)
  }
}

function createAssertion() {
  PRINT(
    "INFO: In createAssertion.. the selected prize is: {0}",
    window.selectedPrize
  );
  var badgeId = getBadgeId(window.selectedPrize);
  
  PRINT("INFO In createAssertion.. the badgeId is {0}", badgeId)

  var assertion_url = format(
    BADGR_BASE_URL + BADGR_ASSERTION_BADGECLASS_PATH,
    badgeId
  );
  PRINT("INFO: In createAssertion.. the assertion url is: {0}", assertion_url);
  $.ajax({
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: "application/json",
    url: assertion_url,
    // data: JSON.stringify({"name": name, "description": "An FCC prize category."}),
    data: JSON.stringify({
      recipient: {
        identity: useremail,
        type: "email",
        hashed: false,
        plaintextIdentity: username
      }
    }),
    success: function(data, status, xhr) {
      PRINT(
        "SUCCESS: In createAssertion.. assertion created: {0}",
        JSON.stringify(data)
      );
    },
    error: function(xhr, status, errMsg) {
      PRINT(
        "ERROR: In createAssertion.. assertion creation failed! {0} {1}",
        status,
        errMsg
      );
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + BADGR_ACCESS_TOKEN);
      xhr.setRequestHeader("Content-Type", "application/json");
    }
  });
}

function createPrizeAssertions(ep_spent) {
  PRINT("INFO: In createPrizeAssertion");
  for (var i = 0; i < ep_spent; i++) {
    createAssertion();
  }
}

function onSelectPrizeEvent(title) {
  window.selectedPrize = convertToSlug(title);
  $("#placeBidModal").modal();
}

function onPlaceBidEvent() {
  ep_spent = document.getElementById("num-spent-input").value;
  ep_saved = window.num_epiph_asserts;
  if (ep_spent == 0) {
    return true;
  }
  PRINT("INFO: In onPlaceBidEvent");

  ep_left = ep_saved - ep_spent;
  PRINT(
    "INFO: ep_left: {0} ep_saved: {1} ep_spent: {2}",
    ep_left,
    ep_saved,
    ep_spent
  );
  createPrizeAssertions(ep_spent);
  deleteAssertions(ep_spent);
  $("#welcome-video").remove();
  $("#welcome-title").text("Good job cryptonaut and good luck!");
  $("#introductory-text").text(
    "You now are entered to win, an email will be sent you confirming your bid."
  );
  var msg =
    "Now you can continue to bid on another prize with your remaining " +
    ep_left +
    " Epiphany Points, or go on back to the control center to earn some more!";
  $("#congrats-instructions").text(msg);
  $("#congrats-instructions").after(
    '<br/><a href="https://learn.firstcontactcrypto.com/dashboard" type="button" class="btn btn-primary">Mission Control</a>'
  );
  ep_saved = window.num_epiph_asserts;

  ep_left = ep_saved - ep_spent;
  createPrizeAssertions(ep_spent);
  deleteAssertions(ep_spent);

  return true;
}

function convertToSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

function getPrizeList() {
  PRINT("INFO: In getPrizeList");
  $(".prize").each(function(index) {
    var txt = convertToSlug($(this).text());
    PRINT("INFO: In getPrizeList.. the prize is: {0}", txt);
    prizeList.push(txt);
  });
  PRINT("INFO In getPrizeList.. !!! the prizeList is: {0}", prizeList)
  return prizeList
}

function getBadgeClassNamesList() {
  PRINT(
    "INFO: In getBadgeClassNameList.. {0}",
    window.badgeclasses.result.length
  );
  for (var i = 0; i < window.badgeclasses.result.length; i++) {
    var name = window.badgeclasses.result[i].name;
    PRINT("INFO In getBadgeClassNameList the name being added is: {0}", name)
    badgeclassNamesList.push(name);
  }
  PRINT("INFO: bcnl: {0}", badgeclassNamesList.length);
  return badgeclassNamesList;
}

function getBadgesToBeCreated(prizeList) {
  PRINT("INFO: In getBadgesToBeCreated");
  if (window.badgeclasses == null) {
    testBadgesCreated();
  }
  getBadgeClassNamesList();
  PRINT("INFO: In getBadgesToBeCreated.. prizeList is: {0}", prizeList)
  prizelist_set = new Set(prizeList);
  badgeclass_set = new Set(window.badgeclassNamesList);
  output_set = new Set([...prizelist_set].filter(x => !badgeclass_set.has(x)));
  PRINT(
    "INFO: In getBadgesToBeCreated.. prizelist_set size: {0} .. badgeclass_set size: {1} .. out size: {2} .. the output_set: {3}",
    prizelist_set.size,
    badgeclass_set.size,
    output_set.size,
    output_set
  );
  return Array.from(output_set);
}

async function testBadgesCreated() {
  PRINT("INFO: In testBadgesCreated");
  started = false 
  if (started === true) {
    window.timer_now_time += 3000;
  }
  started = true;
  PRINT("INFO: In testBadgesCreated");
  if (badgeclasses == null) {
    await sleep(500);
    if (window.timer_now_time > 6000) {
      PRINT(
        "In testBadgesCreated.. WTF 6000 ms have passed, calling getBadgeClasses"
      );
      getBadgeClasses();
      started = false;
      now_time = 0;
    }
    testBadgesCreated();
  } else {
    PRINT(
      "SUCCESS: In testBadgesCreated.. badgeclasses list created.. \\o/ {0}",
      window.badgeclasses.result.length
    );
  }
}

async function testAssertionsCreated() {
  PRINT("INFO: In testAssertionsCreated");
  started = false
  if (started === true) {
    window.timer_now_time += 3000;
  }
  started = true;
  if (assertions == null) {
    await sleep(500);
    testAssertionsCreated();
  } else {
    PRINT(
      "SUCCESS: In testAssertionsCreated.. assertions list created.. \\0/ {0}",
      window.assertions.result.length
    )
  }
}

function getBadgeId(name) {
  // if (window.badgeclasses == null) {
  //   testBadgesCreated();
  // }
  var num = badgeclasses.result.length;
  PRINT(
    "DASHBOARD: In getBadgeId.. the num badgeclasses is: {0} .. the name is: {1}",
    num,
    name
  );
  for (var i = 0; i < num; i++) {
    var bc = window.badgeclasses.result[i];
    PRINT("DASHBOARD: In getBadgeId.. the bc.name is: {0} .. the name is: {1}", bc.name, name)
    if (bc.name === name) {
      return bc.entityId;
    }
  }
}

getUrlVars();
getBadgeClasses();
testBadgesCreated();
pl = getPrizeList();
PRINT("INFO: In global_scope.. prizeList: {0}", prizeList.toString());
var new_badges_needed = getBadgesToBeCreated(pl);
var num_badges_needed = new_badges_needed.length;
PRINT("DASHBOARD: In global_scope.. num_badges_needed: {0}", num_badges_needed);
if (num_badges_needed > 0) {
  createBadges(new_badges_needed);
}
getAssertions();
testAssertionsCreated();
displaySpendEPText();


