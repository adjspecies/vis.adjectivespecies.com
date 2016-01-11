<!DOCTYPE html>
<!--
    http://vis.adjectivespecies.com - visualizations of the furry fandom.
    Copyright (C) 2012  Madison Scott-Clary

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<html>
    <head>
        <title>FA Statistics Submission Form</title>
        <link rel="stylesheet" type="text/css" href="http://assets.adjectivespecies.com/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="/base.css" />
        <link rel="icon" type="image/png" href="http://assets.adjectivespecies.com/favicon.png" />
        <link rel="stylesheet" type="text/css" href="http://vis.mjs-svc.com/_lib/theme/css/smoothness/jquery-ui-1.8.6.custom.css" />
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
            <a href="http://adjectivespecies.com"><img src="http://assets.adjectivespecies.com/as-header.png" /></a>
        </header>
        <h1>Submit your FA Stats</h1>
        <?php
if ($_SERVER['REQUEST_METHOD'] == "POST" && $_POST['user'] && $_POST['data'] && //) {
        preg_match('/' . $_POST['user'] . '/', $_POST['data'])) {
    // save data
    $filename = preg_replace("/^\W*/", "", $_POST['user']);
    $urltest = @fopen("http://furaffinity.net/user/" . $filename, "r");
    $handle = null;
    if ($urltest) {
        $handle = fopen("raw/{$filename}", (isset($_POST['append']) && $_POST['append'] == "checked" ? 'a' : 'w'));
    }
    if ($handle) {
        fwrite($handle, $_POST['data']);
        fclose($handle);
        // parse, let the user know
        $raw = fopen("raw/{$filename}", "r");
        $data = fopen("data/{$filename}.js", "w");
        $currSubmission = -1;
        $previewSection = false;
        $infoSection = false;
        $descSection = false;
        $json = array(); 
        while (($line = fgets($raw)) !== false) {
            if (preg_match('/<tr id="id_(\d+)/', $line, $matches)) {
                $currSubmission++;
                $json[$currSubmission] = array();
                $json[$currSubmission]["id"] = $matches[1];
                continue;
            }
            if ($currSubmission != -1) {
                if (preg_match('/<td class="preview">/', $line)) {
                    $previewSection = true;
                    continue;
                }
                if (preg_match('/<td class="info">/', $line)) {
                    $infoSection = true;
                    continue;
                }
                if (preg_match('/<td class="desc">/', $line)) {
                    $descSection = true;
                    continue;
                }
                if (($previewSection || $descSection || $infoSection) && preg_match('/^\s*<\/t(d|r)>\s*$/', $line)) {
                    $previewSection = false;
                    $infoSection = false;
                    $descSection = false;
                    continue;
                }
                if ($previewSection && preg_match('/<div class="thumb-overlay icon-(\w+) (\w+)">/', $line, $matches)) {
                    $json[$currSubmission]["type"] = $matches[1];
                    $json[$currSubmission]["rating"] = $matches[2];
                    continue;
                }
                if ($infoSection && preg_match('/<dt><a href="[^"]+">([^<]+)<\/a>, <span title="([^"]+)".+>/', $line, $matches)) {
                    $json[$currSubmission]["title"] .= preg_replace("/(<[^>]+>|[\r\n\t]+|(\&\w+;))/", " ", $matches[1]);
                    $json[$currSubmission]["datePosted"] = strtotime($matches[2]);
                    continue;
                }
                if ($infoSection && preg_match('/<dd><span>Views:<\/span> (\d+)<\/dd>/', $line, $matches)) {
                    $json[$currSubmission]["views"] = $matches[1];
                    continue;
                }
                if ($infoSection && preg_match('/<dd><span>Favorites:<\/span> <a[^>]+>(\d+)<\/a><\/dd>/', $line, $matches)) {
                    $json[$currSubmission]["faves"] = $matches[1];
                    continue;
                }
                if ($infoSection && preg_match('/<dd><span>Comments:<\/span> (\d+)<\/dd>/', $line, $matches)) {
                    $json[$currSubmission]["comments"] = $matches[1];
                    continue;
                }
                if (preg_match('/<td class="desc">/', $line)) {
                    $descSection = true;
                    $json[$currSubmission]["desc"] = "";
                    if (!$json[$currSubmission]["faves"]) $json[$currSubmission]["faves"] = '';
                    if (!$json[$currSubmission]["id"]) $json[$currSubmission]["id"] = '';
                    if (!$json[$currSubmission]["title"]) $json[$currSubmission]["title"] = 0;
                    if (!$json[$currSubmission]["comments"]) $json[$currSubmission]["comments"] = 0;
                    if (!$json[$currSubmission]["datePosted"]) $json[$currSubmission]["datePosted"] = 0;
                    if (!$json[$currSubmission]["views"]) $json[$currSubmission]["views"] = 0;
                    continue;
                }
                if ($descSection) {
                    $json[$currSubmission]["desc"] .= preg_replace("/(<[^>]+>|[\r\n\t]+|(\&\w+;))/", " ", $line);
                    continue;
                }
            }
        }
        fwrite($data, "var data = " . json_encode($json));
        echo("<!-- ". json_encode($json) ." -->");
        echo("<p>Data written!  View your stats at <a href=\"/fastats/?user={$filename}\">your page</a>.</p>");
    } else {
        // Let the user know
?>
<div class="error">Unfortunately, there was a problem opening your file for writing.  Try again, perhaps?</div>
<?php
    }
} else { ?>
        <form method="post" id="vis" style="padding: 0.5em;">
            <p class="odd">Please be sure to read the <a href="help.shtml">help</a> if you have any questions!</p>
            <fieldset>
                <legend>FurAffinity Statistics</legend>
                    <label for="user">FA Username</label>
                    <div class="controls"><input type="text" name="user" /><p class="help-block"> (what you use to log in to FA - we will never ask for your password!)</p></div>
                    <label for="data">Statistics page source code</label> 
                    <div class="controls"><textarea name="data" rows="20" cols="70" style="width: 600px!important;"></textarea><p class="help-block">(When viewing your stats tab, view each page's source code and copy/paste all of it into this box)</p></div>
                    <label for="append">Append this data to your current data</label>
                    <div class="controls"><input type="checkbox" name="append" value="checked" checked="checked" /> Append <p class="help-block">(Uncheck this for the first page, leave it checked for all other pages; NB: if you mess up, uncheck this box and it will wipe out the old data!)</p></div>
            </fieldset>
            <p style="text-align: center"><input type="submit" /></p>
        </form>
<?php } ?>
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
