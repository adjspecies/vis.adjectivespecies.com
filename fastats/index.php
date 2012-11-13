<html>
    <head>
        <title>FurAffinity Stats Visualizer</title>
        <link rel="stylesheet" type="text/css" href="/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="/base.css" />
        <link rel="stylesheet" type="text/css" href="http://vis.mjs-svc.com/_lib/theme/css/smoothness/jquery-ui-1.8.6.custom.css" />
        <script type="text/javascript" src="http://lib.jnsq.us/protovis"></script>
        <script type="text/javascript" src="http://lib.jnsq.us/jquery/1.6.2"></script>
        <script type="text/javascript" src="http://lib.jnsq.us/jquery-ui/1.8.14"></script>
<?
if (isset($_GET['user'])) {
    $user = $_GET['user'];
?>
        <script type="text/javascript" src="data/<? print $user; ?>.js"></script>
<? 
} 
?>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>
    <body>
        <div class="topbar">
            <div class="topbar-inner">
                <div class="container-fluid">
                    <a class="brand" href="http://adjectivespecies.com">[adjective][species]</a>
                    <ul class="nav">
                        <li><a href="http://survey.adjectivespecies.com">Surveys</a></li>
                        <li class="active"><a href="http://vis.adjectivespecies.com">Visualizations</a></li>
                        <li><a href="http://forums.adjectivespecies.com">Forums</a></li>
                        <li><a href="http://twitter.com/adjspecies">Twitter</a></li>
                        <li><a href="http://furaffinity.net/user/adjspecies">FurAffinity</a></li>
                        <li><a href="https://plus.google.com/112736664779432876558?prsrc=3">Google+</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <header>
            <a href="http://adjectivespecies.com"><img src="/as-header.png" /></a>
        </header>
<?
if ($user) {
?>
        <h1>FA Stats: <? print $user; ?></h1>
        <div id="vis">
            <script type="text/javascript+protovis">
                var user, max, vis;

data.sort(function(a, b) { return b.datePosted - a.datePosted; });

vis = new pv.Panel()
    .width(1000)
    .height(700)
    .fillStyle("#fff");

var viewsX = new pv.Scale.linear(0, pv.max(data.map(function(d) parseInt(d.views)))).range(0, 100);
var favesX = new pv.Scale.linear(0, pv.max(data.map(function(d) parseInt(d.faves)))).range(0, 100);
var commentsX = new pv.Scale.linear(0, pv.max(data.map(function(d) parseInt(d.comments)))).range(0, 100);
var popX = new pv.Scale.linear(
    pv.min(data.map(function(d) popularity(d))),
    pv.max(data.map(function(d) popularity(d)))).range(0, 100);
var colors = pv.Colors.category20();
var ratingColors = { general: "#ccc", mature: "steelblue", adult: "red" };
var isViews = 2;
var step = 1000 / data.length;
var typeAndRating = false;
if (data[0] && data[0].type && data[0].rating) typeAndRating = true

var barGraph = vis.add(pv.Panel)
    .top(0)
    .left(0)
    .width(1000)
    .height(100)
    .fillStyle("#eee");

var bars = barGraph.add(pv.Bar)
    .data(data)
    .width(step)
    .left(function() this.index * step)
    .bottom(0)
    .fillStyle(function(d) colors(d.views))
    .cursor("hand")
    .event("click", function(d) window.open("http://furaffinity.net/view/" + d.id))
    .event("mouseover", function(d) updateDesc(d))
    .event("mouseout", function(d) updateDesc(null));
var barLabels = bars.anchor("bottom").add(pv.Label)
    .text(function(d) d.title && d.title.length > 20 ? d.title.substr(0, 17) + "..." : d.title)
    .textAlign("right")
    .textBaseline("middle")
    .textAngle(-Math.PI / 2)
    .visible(step > 11);
var typeLabels = bars.anchor("top").add(pv.Label)
    .text(function(d) typeAndRating ? d.type : "")
    .textAlign("left")
    .textBaseline("middle")
    .textAngle(-Math.PI / 2)
    .visible(false);
var ratingLegend = vis.add(pv.Panel)
    .width(200)
    .top(220)
    .left(400)
    .visible(false);
ratingLegend.add(pv.Bar)
    .width(15)
    .height(15)
    .left(0)
    .fillStyle(ratingColors.general)
.anchor("right").add(pv.Label)
    .textAlign("left")
    .text("General");
ratingLegend.add(pv.Bar)
    .width(15)
    .height(15)
    .left(65)
    .fillStyle(ratingColors.mature)
.anchor("right").add(pv.Label)
    .textAlign("left")
    .text("Mature");
ratingLegend.add(pv.Bar)
    .width(15)
    .height(15)
    .left(123)
    .fillStyle(ratingColors.adult)
.anchor("right").add(pv.Label)
    .textAlign("left")
    .text("Adult");


var nest = pv.nest(data).key(function(d) d.id).entries();
var steamGraph = vis.add(pv.Panel)
    .top(240)
    .left(0)
    .height(420)
    .width(1000)
.add(pv.Layout.Stack)
    .layers(["popularity", "views", "faves", "comments"])
    .order("inside-out")
    .offset("silohouette")
    .values(data)
    .x(function() this.index * step + (step / 2))
    .y(function(d, p) {
        switch (p) {
            case "popularity":
                return popX(popularity(d));
            case "views":
                return viewsX(d.views);
            case "faves":
                return favesX(d.faves);
            case "comments":
                return commentsX(d.comments);
        }
    })
.layer.add(pv.Area)
    .cursor("crosshair")
    .title(function(d, p) p)
    .interpolate("cardinal")
    .fillStyle(function(d, p) colors(p))
    .strokeStyle(function() this.fillStyle().alpha(.5));

var toggler = vis.add(pv.Panel)
    .bottom(0)
    .left(0)
    .width(100)
    .height(25)
    .fillStyle("#333")
    .cursor("hand")
    .event("click", toggleViewsFaves);
var tLabel = toggler.anchor("left").add(pv.Label)
    .textStyle("#eee")
    .font("14pt Serif");
toggler.anchor("top").add(pv.Label)
    .textBaseline("bottom")
    .text("Click to toggle");

var desc = vis.add(pv.Panel)
    .bottom(0)
    .left(105)
    .width(900)
    .height(25);
var dLabel = desc.anchor("top").add(pv.Label)
    .textStyle("#555")
    .font("12pt serif");

vis.add(pv.Label)
    .top(235)
    .left(15)
    .font("bold small-caps 15pt serif")
    .textStyle("#040")
    .text("New");
vis.add(pv.Label)
    .top(250)
    .left(15)
    .font("bold small-caps 8pt serif")
    .text(new Date(data[0].datePosted * 1000).toDateString());
vis.add(pv.Label)
    .top(235)
    .right(15)
    .font("bold small-caps 15pt serif")
    .textStyle("#040")
    .textAlign("right")
    .text("Old");
vis.add(pv.Label)
    .top(250)
    .right(15)
    .font("bold small-caps 8pt serif")
    .textAlign("right")
    .text(new Date(data[data.length - 1].datePosted * 1000).toDateString());
vis.add(pv.Rule)
    .top(235)
    .left(15)
    .right(15)
    .strokeStyle("#000");

if (step <= 11) {
    vis.add(pv.Label)
        .top(125)
        .left(500)
        .font("bold small-caps 13pt serif")
        .textStyle("#400")
        .textAlign("center")
        .text("Too many submissions, titles not shown");
}

toggleViewsFaves();

function toggleViewsFaves() {
    switch (isViews) {
        case 0:
            bars.height(function(d) favesX(d.faves))
                .fillStyle(function(d) colors(d.faves))
                .title(function(d) d.title + ": " + d.faves + " faves");
            tLabel.text("Faves");
            typeLabels.visible(false);
            ratingLegend.visible(false);
            isViews = 1;
            break;
        case 1:
            bars.height(function(d) viewsX(d.views))
                .fillStyle(function(d) colors(d.views))
                .title(function(d) d.title + ": " + d.views + " views");
            tLabel.text("Views");
            isViews = 2;
            break;
        case 2:
            bars.height(function(d) commentsX(d.comments))
                .fillStyle(function(d) colors(d.comments))
                .title(function(d) d.title + ": " + d.comments + " comments");
            tLabel.text("Comments");
            isViews = 3;
            break;
        case 3:
            bars.height(function(d) popX(popularity(d)))
                .fillStyle(function(d) colors(popularity(d)))
                .title(function(d) d.title + ": " + popularity(d) + " popularity points");
            tLabel.text("Popularity");
            isViews = (typeAndRating ? 4 : 0);
            break;
        case 4:
            bars.height(function(d) step > 11 ? popX(popularity(d)) / 2 : popX(popularity(d)))
                .fillStyle(function(d) ratingColors[d.rating])
                .title(function(d) d.title + ": " + d.rating + " " + d.type);
            typeLabels.visible(step > 11);
            ratingLegend.visible(true);
            tLabel.text("Rating/Type");
            isViews = 0;
            break;
    }
    vis.render();
}

function updateDesc(d) {
    if (d) {
        dLabel.text(d.desc.length && d.desc.length > 140 ? d.desc.substr(0, 140) + "..." : d.desc);
    } else {
        dLabel.text("");
    }
    vis.render();
}

function popularity(d) {
    return Math.floor((parseInt(d.views) + parseInt(d.faves) + parseInt(d.comments)) / 3);
}
            </script>
        </div>
            <p style="text-align: center"><a href=".">FurAffinity.net Statistics Visualizer</a> | <a href="help.html">What is this?</a></p>
<?
} else {
?>
        <h1>FurAffinity Statistics</h1>
        <div id="vis" style="padding: 0.5em">
            <p>Welcome to the FurAffinity.net Statistics visualizer.  This is a place for you to drop off your stats and view them in an easy to understand visual format.  You may view how your comments, views, faves, and overall popularity of submissions compare with each other and over time.  This is a project by <a href="http://drab-makyo.com">Matthew Scott</a>.</p>
            <p class="even"><a href="help.shtml">Help</a> on the visualizer (read me first :3 )</p>
            <p class="odd"><a href="?user=ranna">View a sample</a></p>
            <p class="even"><a href="list.php">See who else has posted their stats</a></p>
            <p class="odd"><a href="submit.php">Submit your own stats</a> (note that, by using this tool, others will be able to view the statistics that you visualize with it; if you are concerned about this, it would probably be best to not use this tool)</p>
        </div>
<? } ?>
        <footer>
            <a href="http://lib.jnsq.us/license/cc-by-nc-sa" target="_blank"><img src="http://lib.jnsq.us/licenses/small/by-nc-sa_inline.png" alt="CC BY-NC-SA (Attribution-NonCommercial-ShareAlike)" /> [adjective][species], 2012</a> under the CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) license
        </footer>
<!-- Piwik --> 
    <script type="text/javascript">
    var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.jnsq.us/" : "http://piwik.jnsq.us/");
    document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
    </script><script type="text/javascript">
        try {
            var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 9);
            piwikTracker.trackPageView();
            piwikTracker.enableLinkTracking();
        } catch( err ) {}
            </script><noscript><p><img src="http://piwik.jnsq.us/piwik.php?idsite=9" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tracking Tag -->
    </body>
</html>
