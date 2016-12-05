var orig_seed = undefined;
var seed = 0;


function random() {
    if (orig_seed == undefined) {
        orig_seed = seed;
    }
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(
        window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    vars = $.extend({"seed": Math.floor(Math.random() * 100000),
                     "clicked": ""}, vars);
    vars["clicked"] = vars["clicked"].split(",");
    return vars;
}


function isClicked(cid) {
    return $(cid).hasClass("clicked")
}


function setPermalink() {
    params = {"seed": orig_seed};

    clicked = [];
    for (var row = 1; row < 6; row++) {
        for (var cell = 1; cell < 6; cell++) {
            if (row != 3 || cell != 3) {
                var cid = "r" + row + "c" + cell;
                if (isClicked("#" + cid)) {
                    clicked.push(cid);
                }
            }
        }
    }
    params["clicked"] = clicked.join(",");

    quest_idx = window.location.href.indexOf('?');
    if (quest_idx == -1) {
        var baseUrl = window.location.href;
    } else {
        var baseUrl = window.location.href.slice(0, quest_idx);
    }

    queryString = Object.keys(params).map(function(k){
        return k + "=" + params[k];
    }).join('&');
    $("#permalink").attr("href", baseUrl + "?" + queryString);
}


function populate(clicked) {
    $.getJSON("categories.json", function(json) {
        data = shuffle(json);
        var table = "<thead class=\"bingohead\"><tr><td colspan=\"5\">LISA BINGO</td></tr></thead>";
        for (var row = 1; row < 6; row++) {
            var rid = "row" + row;
            table += "<tr class=\"bingorow\" id=\"" + rid + "\">";
            for (var cell = 1; cell < 6; cell++) {
                if (row != 3 || cell != 3) {
                    var cid = "r" + row + "c" + cell;
                    table += "<td class=\"bingocell\" id=\"" + cid +
                        "\" onClick=\"cellClick('#" + cid + "')\">" +
                        "<span class=\"bingotext\">" + data.pop() +
                        "</span></td>";
                } else {
                    table += "<td class=\"bingocell clicked\" " +
                        "id=\"free\">FREE</td>";
                }
            }
            table += "</tr>";
        }
        $("#card").html(table);

        for (var i = 0; i < clicked.length; i++) {
            cid = "#" + clicked[i]
            $(cid).addClass("clicked")
        }

        setPermalink();
    });
}


function cellClick(cid) {
    $(cid).toggleClass("clicked")

    setPermalink();
}
